import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CoverLetter, CoverLetterSchema } from "../../models/CoverLetter";
import { CoverLetterController } from "./cover-letter.controller";
import { CoverLetterService } from "./cover-letter.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CoverLetter.name, schema: CoverLetterSchema },
    ]),
  ],
  controllers: [CoverLetterController],
  providers: [CoverLetterService],
  exports: [CoverLetterService],
})
export class CoverLetterModule {}
