import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class CloudStorageService {
  private readonly logger = new Logger(CloudStorageService.name);
  private isCloudinaryConfigured = false;

  constructor(private readonly configService: ConfigService) {
    const cloudName = this.configService.get<string>("CLOUDINARY_CLOUD_NAME") || process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = this.configService.get<string>("CLOUDINARY_API_KEY") || process.env.CLOUDINARY_API_KEY;
    const apiSecret = this.configService.get<string>("CLOUDINARY_API_SECRET") || process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret && cloudName !== "your_cloud_name") {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      this.isCloudinaryConfigured = true;
      this.logger.log(`Cloudinary Storage initialized with cloud name: ${cloudName}`);
    } else {
      this.logger.log("Cloudinary credentials not provided. Using local disk storage fallback (./uploads/).");
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: "resumes" | "avatars" = "resumes"
  ): Promise<{ url: string; isCloud: boolean }> {
    if (!file) {
      throw new Error("No file provided for upload");
    }

    if (this.isCloudinaryConfigured) {
      try {
        const resourceType = folder === "resumes" ? "auto" : "image";
        
        let result: any;
        if (file.path && fs.existsSync(file.path)) {
          result = await cloudinary.uploader.upload(file.path, {
            folder: `ai-resume-analyzer/${folder}`,
            resource_type: resourceType,
          });
          
          fs.unlinkSync(file.path);
        } else if (file.buffer) {
          result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: `ai-resume-analyzer/${folder}`,
                resource_type: resourceType,
              },
              (error, res) => {
                if (error) return reject(error);
                resolve(res);
              }
            );
            uploadStream.end(file.buffer);
          });
        }

        if (result && result.secure_url) {
          this.logger.log(`File uploaded successfully to Cloudinary: ${result.secure_url}`);
          return { url: result.secure_url, isCloud: true };
        }
      } catch (error: any) {
        this.logger.error(`Cloudinary upload failed: ${error.message}. Falling back to local URL.`);
      }
    }

    const relativeUrl = `/uploads/${folder}/${file.filename || path.basename(file.path || '')}`;
    return { url: relativeUrl, isCloud: false };
  }
}
