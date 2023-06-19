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
import { ProductType } from "../../entities/product.entity";import { DamImageBlock } from "@comet/cms-api";

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
    
    @IsNullable()
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
    
    @IsNullable()
@Field({ nullable: true })
@IsUUID()
    category?: string;
    
    @Field(() => [String])
@IsArray()
@IsUUID(undefined, { each: true })
    tags: string[];
    
    
}

@InputType()
export class ProductUpdateInput extends PartialType(ProductInput) {}
