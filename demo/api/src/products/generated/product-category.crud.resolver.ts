// This file has been generated by comet api-generator.
// You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.
import { extractGraphqlFields, SubjectEntity, validateNotModified } from "@comet/cms-api";
import { FindOptions, Reference } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Args, ID, Info, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql";

import { Product } from "../entities/product.entity";
import { ProductCategory } from "../entities/product-category.entity";
import { PaginatedProductCategories } from "./dto/paginated-product-categories";
import { ProductCategoriesArgs } from "./dto/product-categories.args";
import { ProductCategoryInput, ProductCategoryUpdateInput } from "./dto/product-category.input";
import { ProductCategoriesService } from "./product-categories.service";

@Resolver(() => ProductCategory)
export class ProductCategoryCrudResolver {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly productCategoriesService: ProductCategoriesService,
        @InjectRepository(ProductCategory) private readonly repository: EntityRepository<ProductCategory>,
        @InjectRepository(Product) private readonly productRepository: EntityRepository<Product>,
    ) {}

    @Query(() => ProductCategory)
    @SubjectEntity(ProductCategory)
    async productCategory(@Args("id", { type: () => ID }) id: string): Promise<ProductCategory> {
        const productCategory = await this.repository.findOneOrFail(id);
        return productCategory;
    }

    @Query(() => ProductCategory, { nullable: true })
    async productCategoryBySlug(@Args("slug") slug: string): Promise<ProductCategory | null> {
        const productCategory = await this.repository.findOne({ slug });

        return productCategory ?? null;
    }

    @Query(() => PaginatedProductCategories)
    async productCategories(
        @Args() { search, filter, sort, offset, limit }: ProductCategoriesArgs,
        @Info() info: GraphQLResolveInfo,
    ): Promise<PaginatedProductCategories> {
        const where = this.productCategoriesService.getFindCondition({ search, filter });

        const fields = extractGraphqlFields(info, { root: "nodes" });
        const populate: string[] = [];
        if (fields.includes("products")) {
            populate.push("products");
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options: FindOptions<ProductCategory, any> = { offset, limit, populate };

        if (sort) {
            options.orderBy = sort.map((sortItem) => {
                return {
                    [sortItem.field]: sortItem.direction,
                };
            });
        }

        const [entities, totalCount] = await this.repository.findAndCount(where, options);
        return new PaginatedProductCategories(entities, totalCount);
    }

    @Mutation(() => ProductCategory)
    async createProductCategory(@Args("input", { type: () => ProductCategoryInput }) input: ProductCategoryInput): Promise<ProductCategory> {
        const { products: productsInput, ...assignInput } = input;
        const productCategory = this.repository.create({
            ...assignInput,
        });
        {
            const products = await this.productRepository.find({ id: productsInput });
            if (products.length != productsInput.length) throw new Error("Couldn't find all products that where passed as input");
            await productCategory.products.loadItems();
            productCategory.products.set(products.map((product) => Reference.create(product)));
        }

        await this.entityManager.flush();
        return productCategory;
    }

    @Mutation(() => ProductCategory)
    @SubjectEntity(ProductCategory)
    async updateProductCategory(
        @Args("id", { type: () => ID }) id: string,
        @Args("input", { type: () => ProductCategoryUpdateInput }) input: ProductCategoryUpdateInput,
        @Args("lastUpdatedAt", { type: () => Date, nullable: true }) lastUpdatedAt?: Date,
    ): Promise<ProductCategory> {
        const productCategory = await this.repository.findOneOrFail(id);
        if (lastUpdatedAt) {
            validateNotModified(productCategory, lastUpdatedAt);
        }

        const { products: productsInput, ...assignInput } = input;
        productCategory.assign({
            ...assignInput,
        });
        {
            const products = await this.productRepository.find({ id: productsInput });
            if (products.length != productsInput.length) throw new Error("Couldn't find all products that where passes as input");
            await productCategory.products.loadItems();
            productCategory.products.set(products.map((product) => Reference.create(product)));
        }

        await this.entityManager.flush();

        return productCategory;
    }

    @Mutation(() => Boolean)
    @SubjectEntity(ProductCategory)
    async deleteProductCategory(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
        const productCategory = await this.repository.findOneOrFail(id);
        await this.entityManager.remove(productCategory);
        await this.entityManager.flush();
        return true;
    }

    @ResolveField(() => [Product])
    async products(@Parent() productCategory: ProductCategory): Promise<Product[]> {
        return productCategory.products.loadItems();
    }
}
