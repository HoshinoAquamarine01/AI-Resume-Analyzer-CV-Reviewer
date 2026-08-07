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
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { CoverLetterService } from "./cover-letter.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { UserDec } from "../../common/decorators/user.decorator";
import { formatResponse } from "../../utils/formatResponse";

@Controller("cover-letter")
@UseGuards(JwtAuthGuard)
export class CoverLetterController {
  constructor(private readonly coverLetterService: CoverLetterService) {}

  @Post()
  async generateCoverLetter(
    @UserDec() user: any,
    @Body("resumeId") resumeId: string,
    @Body("jobTitle") jobTitle: string,
    @Body("companyName") companyName: string,
    @Body("jobDescription") jobDescription: string
  ) {
    const coverLetter = await this.coverLetterService.generate(
      user._id,
      resumeId,
      jobTitle,
      companyName,
      jobDescription
    );
    return formatResponse(coverLetter, "Cover letter generated");
  }

  @Get()
  async getCoverLetters(
    @UserDec() user: any,
    @Query("page") page = 1,
    @Query("limit") limit = 10
  ) {
    const result = await this.coverLetterService.findAll(user._id, Number(page), Number(limit));
    return formatResponse(result, "Cover letters retrieved");
  }

  @Get("search")
  async searchCoverLetters(
    @UserDec() user: any,
    @Query("query") query = "",
    @Query("page") page = 1,
    @Query("limit") limit = 10
  ) {
    const result = await this.coverLetterService.search(user._id, query, Number(page), Number(limit));
    return formatResponse(result, "Search results");
  }

  @Get(":coverLetterId")
  async getCoverLetterById(@Param("coverLetterId") coverLetterId: string) {
    const coverLetter = await this.coverLetterService.findOne(coverLetterId);
    return formatResponse(coverLetter, "Cover letter retrieved");
  }

  @Put(":coverLetterId")
  async updateCoverLetter(
    @UserDec() user: any,
    @Param("coverLetterId") coverLetterId: string,
    @Body("content") content: string,
    @Body("jobTitle") jobTitle: string,
    @Body("companyName") companyName: string
  ) {
    const updated = await this.coverLetterService.update(
      user._id,
      coverLetterId,
      content,
      jobTitle,
      companyName
    );
    return formatResponse(updated, "Cover letter updated");
  }

  @Delete(":coverLetterId")
  async deleteCoverLetter(
    @UserDec() user: any,
    @Param("coverLetterId") coverLetterId: string
  ) {
    const result = await this.coverLetterService.delete(user._id, coverLetterId);
    return formatResponse(null, result.message);
  }

  @Post("improve")
  async improveCoverLetter(
    @UserDec() user: any,
    @Body("coverLetterId") coverLetterId: string,
    @Body("section") section: string
  ) {
    const updated = await this.coverLetterService.improveSection(user._id, coverLetterId, section);
    return formatResponse(updated, "Cover letter improved");
  }

  @Post(":coverLetterId/duplicate")
  async duplicateCoverLetter(
    @UserDec() user: any,
    @Param("coverLetterId") coverLetterId: string
  ) {
    const duplicated = await this.coverLetterService.duplicate(user._id, coverLetterId);
    return formatResponse(duplicated, "Cover letter duplicated");
  }

  @Get(":coverLetterId/download")
  async downloadCoverLetter(
    @Param("coverLetterId") coverLetterId: string,
    @Res() res: Response
  ) {
    const coverLetter = await this.coverLetterService.findOne(coverLetterId);
    const pdfBuffer = await this.coverLetterService.generatePdf(coverLetter);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="cover-letter-${coverLetter._id}.pdf"`
    );
    res.send(pdfBuffer);
  }

  @Get(":coverLetterId/export")
  async exportCoverLetter(
    @Param("coverLetterId") coverLetterId: string,
    @Query("format") format = "pdf",
    @Res() res: Response
  ) {
    const coverLetter = await this.coverLetterService.findOne(coverLetterId);
    let exported: any;

    if (format === "pdf") {
      exported = await this.coverLetterService.generatePdf(coverLetter);
      res.setHeader("Content-Type", "application/pdf");
    } else if (format === "docx") {
      exported = await this.coverLetterService.generateDocx(coverLetter);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
    } else {
      exported = Buffer.from(JSON.stringify(coverLetter, null, 2));
      res.setHeader("Content-Type", "application/json");
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="cover-letter-${coverLetter._id}.${format}"`
    );
    res.send(exported);
  }
}
