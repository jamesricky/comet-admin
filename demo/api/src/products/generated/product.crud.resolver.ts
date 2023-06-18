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
import { ProductTag } from "../entities/product-tag.entity";
import { PaginatedProducts } from "./dto/paginated-products";
import { ProductInput } from "./dto/product.input";
import { ProductsArgs } from "./dto/products.args";
import { ProductsService } from "./products.service";

@Resolver(() => Product)
export class ProductCrudResolver {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly productsService: ProductsService,
        @InjectRepository(Product) private readonly repository: EntityRepository<Product>,
        @InjectRepository(ProductCategory) private readonly productCategoryRepository: EntityRepository<ProductCategory>,
        @InjectRepository(ProductTag) private readonly productTagRepository: EntityRepository<ProductTag>,
    ) {}

    @Query(() => Product)
    @SubjectEntity(Product)
    async product(@Args("id", { type: () => ID }) id: string): Promise<Product> {
        const product = await this.repository.findOneOrFail(id);
        return product;
    }

    @Query(() => Product, { nullable: true })
    async productBySlug(@Args("slug") slug: string): Promise<Product | null> {
        const product = await this.repository.findOne({ slug });

        return product ?? null;
    }

    @Query(() => PaginatedProducts)
    async products(@Args() { search, filter, sort, offset, limit }: ProductsArgs, @Info() info: GraphQLResolveInfo): Promise<PaginatedProducts> {
        const where = this.productsService.getFindCondition({ search, filter });

        const fields = extractGraphqlFields(info, { root: "nodes" });
        const populate: string[] = [];
        if (fields.includes("category")) {
            populate.push("category");
        }
        if (fields.includes("tags")) {
            populate.push("tags");
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options: FindOptions<Product, any> = { offset, limit, populate };

        if (sort) {
            options.orderBy = sort.map((sortItem) => {
                return {
                    [sortItem.field]: sortItem.direction,
                };
            });
        }

        const [entities, totalCount] = await this.repository.findAndCount(where, options);
        return new PaginatedProducts(entities, totalCount);
    }

    @Mutation(() => Product)
    async createProduct(@Args("input", { type: () => ProductInput }) input: ProductInput): Promise<Product> {
        const { tags: tagsInput, ...assignInput } = input;
        const product = this.repository.create({
            ...assignInput,
            visible: false,

            image: input.image.transformToBlockData(),
            category: input.category ? Reference.create(await this.productCategoryRepository.findOneOrFail(input.category)) : undefined,
        });
        {
            const tags = await this.productTagRepository.find({ id: tagsInput });
            if (tags.length != tagsInput.length) throw new Error("Couldn't find all tags that where passed as input");
            await product.tags.loadItems();
            product.tags.set(tags.map((p) => Reference.create(p)));
        }

        await this.entityManager.flush();
        return product;
    }

    @Mutation(() => Product)
    @SubjectEntity(Product)
    async updateProduct(
        @Args("id", { type: () => ID }) id: string,
        @Args("input", { type: () => ProductInput }) input: ProductInput,
        @Args("lastUpdatedAt", { type: () => Date, nullable: true }) lastUpdatedAt?: Date,
    ): Promise<Product> {
        const product = await this.repository.findOneOrFail(id);
        if (lastUpdatedAt) {
            validateNotModified(product, lastUpdatedAt);
        }
        const { tags: tagsInput, ...assignInput } = input;
        product.assign({
            ...assignInput,
            image: input.image.transformToBlockData(),
            category: input.category ? Reference.create(await this.productCategoryRepository.findOneOrFail(input.category)) : undefined,
        });
        {
            const tags = await this.productTagRepository.find({ id: tagsInput });
            if (tags.length != tagsInput.length) throw new Error("Couldn't find all tags that where passes as input");
            await product.tags.loadItems();
            product.tags.set(tags.map((p) => Reference.create(p)));
        }

        await this.entityManager.flush();

        return product;
    }

    @Mutation(() => Boolean)
    @SubjectEntity(Product)
    async deleteProduct(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
        const product = await this.repository.findOneOrFail(id);
        await this.entityManager.remove(product);
        await this.entityManager.flush();
        return true;
    }

    @Mutation(() => Product)
    @SubjectEntity(Product)
    async updateProductVisibility(
        @Args("id", { type: () => ID }) id: string,
        @Args("visible", { type: () => Boolean }) visible: boolean,
    ): Promise<Product> {
        const product = await this.repository.findOneOrFail(id);

        product.assign({
            visible,
        });
        await this.entityManager.flush();

        return product;
    }

    @ResolveField(() => ProductCategory, { nullable: true })
    async category(@Parent() product: Product): Promise<ProductCategory | undefined> {
        return product.category?.load();
    }

    @ResolveField(() => [ProductTag])
    async tags(@Parent() product: Product): Promise<ProductTag[]> {
        return product.tags.loadItems();
    }
}
