import { IsIn, IsNumber, IsString } from "class-validator";

export class CreateWatchDto {
  @IsString()
  symbol: string;

  @IsString()
  source: string;

  @IsIn(["<=", ">="])
  operator: "<=" | ">=";

  @IsNumber()
  threshold: number;
}
