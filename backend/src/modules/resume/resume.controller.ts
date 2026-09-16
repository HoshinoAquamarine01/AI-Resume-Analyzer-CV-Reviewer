import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Response } from "express";
import * as path from "path";
import * as fs from "fs";
import { ResumeService } from "./resume.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { UserDec } from "../../common/decorators/user.decorator";
import { formatResponse } from "../../utils/formatResponse";
import { ActivityLogInterceptor } from "../../common/interceptors/activity-log.interceptor";
import { LogActivity } from "../../common/decorators/activity-log.decorator";

import { CloudStorageService } from "../../common/services/cloud-storage.service";

@Controller("resume")
@UseGuards(JwtAuthGuard)
export class ResumeController {
  constructor(
    private readonly resumeService: ResumeService,
    private readonly cloudStorageService: CloudStorageService
  ) {}

  @Post()
  @UseInterceptors(
    ActivityLogInterceptor,
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = path.join(process.cwd(), "uploads", "resumes");
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const name = path.basename(file.originalname, ext);
          cb(null, `${name}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error(`Invalid file type: ${file.mimetype}`), false);
        }
      },
    })
  )
  @LogActivity("UPLOAD_CV")
  async createResume(
    @UserDec() user: any,
    @Body("title") title: string,
    @Body("fileUrl") bodyFileUrl: string,
    @Body("fileType") bodyFileType: "pdf" | "docx",
    @UploadedFile() file?: Express.Multer.File
  ) {
    let finalTitle = title;
    let fileUrl = bodyFileUrl;
    let fileType = bodyFileType;

    let extractedText = "";

    if (file) {
      fileType = file.filename.endsWith(".pdf") ? "pdf" : "docx";
      if (!finalTitle) {
        finalTitle = path.basename(file.originalname, path.extname(file.originalname));
      }
      if (file.path && fs.existsSync(file.path)) {
        extractedText = await this.resumeService.extractTextFromFile(file.path, fileType);
      }
      const uploaded = await this.cloudStorageService.uploadFile(file, "resumes");
      fileUrl = uploaded.url;
    }

    if (!fileUrl || !fileType || !finalTitle) {
      throw new BadRequestException("Resume title, fileUrl/file and fileType are required");
    }

    const resume = await this.resumeService.create(user._id, finalTitle, fileUrl, fileType, extractedText);
    return formatResponse(resume, "Resume created");
  }

  @Get()
  async getResumes(
    @UserDec() user: any,
    @Query("page") page = 1,
    @Query("limit") limit = 10
  ) {
    const result = await this.resumeService.findAll(user._id, Number(page), Number(limit));
    return formatResponse(result, "Resumes retrieved");
  }

  @Get("templates")
  async getTemplates(
    @Query("category") category?: string,
    @Query("query") query?: string
  ) {
    const templates = await this.resumeService.getAvailableTemplates(category, query);
    return formatResponse(templates, "Templates retrieved");
  }

  @Get("search")
  async searchResumes(
    @UserDec() user: any,
    @Query("query") query = "",
    @Query("page") page = 1,
    @Query("limit") limit = 10
  ) {
    const result = await this.resumeService.search(user._id, query, Number(page), Number(limit));
    return formatResponse(result, "Search results");
  }

  @Get(":resumeId")
  async getResumeById(@Param("resumeId") resumeId: string) {
    const resume = await this.resumeService.findOne(resumeId);
    return formatResponse(resume, "Resume retrieved");
  }

  @Put(":resumeId")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = path.join(process.cwd(), "uploads", "resumes");
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const name = path.basename(file.originalname, ext);
          cb(null, `${name}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    })
  )
  async updateResume(
    @UserDec() user: any,
    @Param("resumeId") resumeId: string,
    @Body("title") title: string,
    @Body("fileUrl") bodyFileUrl: string,
    @Body("fileType") bodyFileType: "pdf" | "docx",
    @UploadedFile() file?: Express.Multer.File
  ) {
    let fileUrl = bodyFileUrl;
    let fileType = bodyFileType;

    if (file) {
      fileUrl = `/uploads/resumes/${file.filename}`;
      fileType = file.filename.endsWith(".pdf") ? "pdf" : "docx";
    }

    const updated = await this.resumeService.update(user._id, resumeId, title, fileUrl, fileType);
    return formatResponse(updated, "Resume updated");
  }

  @Delete(":resumeId")
  async deleteResume(@UserDec() user: any, @Param("resumeId") resumeId: string) {
    const result = await this.resumeService.delete(user._id, resumeId);
    return formatResponse(null, result.message);
  }

  @Post(":resumeId/duplicate")
  async duplicateResume(@UserDec() user: any, @Param("resumeId") resumeId: string) {
    const duplicated = await this.resumeService.duplicate(user._id, resumeId);
    return formatResponse(duplicated, "Resume duplicated");
  }

  @Get(":resumeId/share")
  async shareResume(@UserDec() user: any, @Param("resumeId") resumeId: string) {
    const resume = await this.resumeService.share(user._id, resumeId);
    return formatResponse(resume, "Resume can be shared via URL");
  }

  @Get(":resumeId/download")
  async downloadResume(
    @UserDec() user: any,
    @Param("resumeId") resumeId: string,
    @Res() res: Response
  ) {
    const resume = await this.resumeService.share(user._id, resumeId);
    const pdfBuffer = await this.resumeService.generatePdf(resume);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(resume.title)}.pdf"`
    );
    res.send(pdfBuffer);
  }

  @Get(":resumeId/export")
  async exportResume(
    @UserDec() user: any,
    @Param("resumeId") resumeId: string,
    @Query("format") format = "pdf",
    @Res() res: Response
  ) {
    const resume = await this.resumeService.share(user._id, resumeId);
    let exported: any;

    if (format === "pdf") {
      exported = await this.resumeService.generatePdf(resume);
      res.setHeader("Content-Type", "application/pdf");
    } else if (format === "docx") {
      exported = await this.resumeService.generateDocx(resume);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
    } else {
      exported = Buffer.from(JSON.stringify(resume, null, 2));
      res.setHeader("Content-Type", "application/json");
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(resume.title)}.${format}"`
    );
    res.send(exported);
  }

  @Post(":resumeId/analyze")
  @UseInterceptors(ActivityLogInterceptor)
  @LogActivity("RUN_AI_ANALYSIS")
  async generateResumeAnalysis(
    @UserDec() user: any,
    @Param("resumeId") resumeId: string
  ) {
    const analysis = await this.resumeService.createAnalysis(user._id, resumeId, 75); // mock score 75 matching original Express mock
    return formatResponse(analysis, "Resume analysis completed");
  }

  @Get(":resumeId/analysis")
  async getResumeAnalysis(
    @UserDec() user: any,
    @Param("resumeId") resumeId: string
  ) {
    const analysis = await this.resumeService.getAnalysis(user._id, resumeId);
    return formatResponse(analysis, "Resume analysis retrieved");
  }
}
