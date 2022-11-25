import { Factory } from "fishery";
import type { TweetStructure } from "../server/types";
import { faker } from "@faker-js/faker";

const tweetFactory = Factory.define<TweetStructure>(() => ({
  id: faker.database.mongodbObjectId(),
  author: faker.database.mongodbObjectId(),
  backupImage: faker.database.mongodbObjectId(),
  category: faker.random.word(),
  dateOfCreation: faker.date.recent().toDateString(),
  description: faker.lorem.sentence(),
  image: faker.database.mongodbObjectId(),
  visibilityOpen: faker.datatype.boolean(),
}));

export const getRandomTweet = (tweet?: TweetStructure) =>
  tweetFactory.build(tweet);

export const getRandomTweets = (size: number) => tweetFactory.buildList(size);
