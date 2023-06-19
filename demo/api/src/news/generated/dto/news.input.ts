// This file has been generated by comet api-generator.
    // You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.
    import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
<<<<<<< HEAD
import { IsString, IsNotEmpty, ValidateNested, IsNumber, IsBoolean, IsDate, IsOptional, IsEnum, IsUUID, IsArray } from "class-validator";
import { IsSlug, RootBlockInputScalar } from "@comet/cms-api";
=======
import { IsString, IsNotEmpty, ValidateNested, IsNumber, IsBoolean, IsDate, IsOptional, IsEnum } from "class-validator";
import { IsSlug, RootBlockInputScalar, IsNullable, PartialType} from "@comet/cms-api";
>>>>>>> next
import { GraphQLJSONObject } from "graphql-type-json";
import { BlockInputInterface, isBlockInputInterface } from "@comet/blocks-api";
import { NewsCategory } from "../../entities/news.entity";import { DamImageBlock } from "@comet/cms-api";import { NewsContentBlock } from "../../blocks/news-content.block";

@InputType()
export class NewsInput {
    @IsNotEmpty()
@IsString()
@IsSlug()
@Field()
    slug: string;
    
    @IsNotEmpty()
@IsString()
@Field()
    title: string;
    
    @IsNotEmpty()
@IsDate()
@Field()
    date: Date;
    
    @IsNotEmpty()
@IsEnum(NewsCategory)
@Field(() => NewsCategory)
    category: NewsCategory;
    
    @IsNotEmpty()
@Field(() => RootBlockInputScalar(DamImageBlock))
@Transform(({ value }) => (isBlockInputInterface(value) ? value : DamImageBlock.blockInputFactory(value)), { toClassOnly: true })
@ValidateNested()
    image: BlockInputInterface;
    
    @IsNotEmpty()
@Field(() => RootBlockInputScalar(NewsContentBlock))
@Transform(({ value }) => (isBlockInputInterface(value) ? value : NewsContentBlock.blockInputFactory(value)), { toClassOnly: true })
@ValidateNested()
    content: BlockInputInterface;
    
    
}

@InputType()
export class NewsUpdateInput extends PartialType(NewsInput) {}
