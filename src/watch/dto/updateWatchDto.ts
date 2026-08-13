import { PartialType } from "@nestjs/mapped-types";
import { CreateWatchDto } from "./createWatchDto";

export class UpdateWatchDto extends PartialType(CreateWatchDto) {}
