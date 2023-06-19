// This file has been generated by comet api-generator.
// You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.
import { extractGraphqlFields, SubjectEntity, validateNotModified } from "@comet/cms-api";
import { FindOptions } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Args, ID, Info, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql";

import { News, NewsContentScope } from "../entities/news.entity";
import { NewsComment } from "../entities/news-comment.entity";
import { NewsInput, NewsUpdateInput } from "./dto/news.input";
import { NewsListArgs } from "./dto/news-list.args";
import { PaginatedNews } from "./dto/paginated-news";
import { NewsService } from "./news.service";

@Resolver(() => News)
export class NewsCrudResolver {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly newsService: NewsService,
        @InjectRepository(News) private readonly repository: EntityRepository<News>,
    ) {}

    @Query(() => News)
    @SubjectEntity(News)
    async news(@Args("id", { type: () => ID }) id: string): Promise<News> {
        const news = await this.repository.findOneOrFail(id);
        return news;
    }

    @Query(() => News, { nullable: true })
    async newsBySlug(@Args("slug") slug: string): Promise<News | null> {
        const news = await this.repository.findOne({ slug });

        return news ?? null;
    }

    @Query(() => PaginatedNews)
    async newsList(@Args() { scope, search, filter, sort, offset, limit }: NewsListArgs, @Info() info: GraphQLResolveInfo): Promise<PaginatedNews> {
        const where = this.newsService.getFindCondition({ search, filter });
        where.scope = scope;

        const fields = extractGraphqlFields(info, { root: "nodes" });
        const populate: string[] = [];
        if (fields.includes("comments")) {
            populate.push("comments");
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options: FindOptions<News, any> = { offset, limit, populate };

        if (sort) {
            options.orderBy = sort.map((sortItem) => {
                return {
                    [sortItem.field]: sortItem.direction,
                };
            });
        }

        const [entities, totalCount] = await this.repository.findAndCount(where, options);
        return new PaginatedNews(entities, totalCount);
    }

    @Mutation(() => News)
    async createNews(
        @Args("scope", { type: () => NewsContentScope }) scope: NewsContentScope,
        @Args("input", { type: () => NewsInput }) input: NewsInput,
    ): Promise<News> {
        const { ...assignInput } = input;
        const news = this.repository.create({
            ...assignInput,
            visible: false,
            scope,
            image: input.image.transformToBlockData(),
            content: input.content.transformToBlockData(),
        });

        await this.entityManager.flush();
        return news;
    }

    @Mutation(() => News)
    @SubjectEntity(News)
    async updateNews(
        @Args("id", { type: () => ID }) id: string,
        @Args("input", { type: () => NewsUpdateInput }) input: NewsUpdateInput,
        @Args("lastUpdatedAt", { type: () => Date, nullable: true }) lastUpdatedAt?: Date,
    ): Promise<News> {
        const news = await this.repository.findOneOrFail(id);
        if (lastUpdatedAt) {
            validateNotModified(news, lastUpdatedAt);
        }

        const { image: imageInput, content: contentInput, ...assignInput } = input;
        news.assign({
            ...assignInput,
        });

        if (imageInput) {
            news.image = imageInput.transformToBlockData();
        }
        if (contentInput) {
            news.content = contentInput.transformToBlockData();
        }

        await this.entityManager.flush();

        return news;
    }

    @Mutation(() => Boolean)
    @SubjectEntity(News)
    async deleteNews(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
        const news = await this.repository.findOneOrFail(id);
        await this.entityManager.remove(news);
        await this.entityManager.flush();
        return true;
    }

    @Mutation(() => News)
    @SubjectEntity(News)
    async updateNewsVisibility(
        @Args("id", { type: () => ID }) id: string,
        @Args("visible", { type: () => Boolean }) visible: boolean,
    ): Promise<News> {
        const news = await this.repository.findOneOrFail(id);

        news.assign({
            visible,
        });
        await this.entityManager.flush();

        return news;
    }

    @ResolveField(() => [NewsComment])
    async comments(@Parent() news: News): Promise<NewsComment[]> {
        return news.comments.loadItems();
    }
}
