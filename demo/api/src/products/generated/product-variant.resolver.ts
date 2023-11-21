// This file has been generated by comet api-generator.
// You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.

import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { Product } from "../entities/product.entity";
import { ProductVariant } from "../entities/product-variant.entity";

@Resolver(() => ProductVariant)
export class ProductVariantResolver {
    @ResolveField(() => Product)
    async product(@Parent() productVariant: ProductVariant): Promise<Product> {
        return productVariant.product.load();
    }
}