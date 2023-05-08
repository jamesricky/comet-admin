// This file has been generated by comet api-generator.
// You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.
import { BlockInputInterface, isBlockInputInterface } from "@comet/blocks-api";
import { DamImageBlock, IsSlug, RootBlockInputScalar } from "@comet/cms-api";
import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

import { ProductType } from "../../entities/product.entity";
@InputType()
export class ProductInput {
    @IsNotEmpty()
    @IsString()
    @Field()
    title: string;

    @IsNotEmpty()
    @IsString()
    @IsSlug()
    @Field()
    slug: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    description: string;

    @IsNotEmpty()
    @IsEnum(ProductType)
    @Field(() => ProductType)
    type: ProductType;

    @IsOptional()
    @IsNumber()
    @Field({ nullable: true })
    price?: number;

    @IsNotEmpty()
    @IsBoolean()
    @Field()
    inStock: boolean;

    @IsNotEmpty()
    @Field(() => RootBlockInputScalar(DamImageBlock))
    @Transform(({ value }) => (isBlockInputInterface(value) ? value : DamImageBlock.blockInputFactory(value)), { toClassOnly: true })
    @ValidateNested()
    image: BlockInputInterface;

    @IsOptional()
    @Field({ nullable: true })
    @IsUUID()
    category?: string;

    @Field(() => [String])
    @IsArray()
    @IsUUID(undefined, { each: true })
    tags: string[];
}
