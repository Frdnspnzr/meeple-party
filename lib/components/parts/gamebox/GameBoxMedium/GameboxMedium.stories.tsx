import { Role } from "@prisma/client";
import type { Meta, StoryObj } from "@storybook/react";
import GameboxMedium from "./GameboxMedium";

const meta = {
  title: "Parts/Gamebox/Medium",
  component: GameboxMedium,
} satisfies Meta<typeof GameboxMedium>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    game: {
      id: 169786,
      name: "Scythe",
      maxPlayers: 5,
      minPlayers: 1,
      playingTime: 115,
      weight: 3.4431,
      year: 2016,
      BGGRank: 17,
      BGGRating: 7.99921,
      image:
        "https://cf.geekdo-images.com/7k_nOxpO9OGIjhLq2BUZdA__original/img/HlDb9F365w0tSP8uD1vf1pfniQE=/0x0/filters:format(jpeg)/pic3163924.jpg",
      thumbnail:
        "https://cf.geekdo-images.com/7k_nOxpO9OGIjhLq2BUZdA__thumb/img/eQ69OEDdjYjfKg6q5Navee87skU=/fit-in/200x150/filters:strip_icc()/pic3163924.jpg",
    },
    friendCollections: {
      own: [testUser(1)],
      wantToPlay: [
        testUser(1),
        testUser(2),
        testUser(3),
        testUser(4),
        testUser(5),
        testUser(6),
      ],
      wishlist: [testUser(2), testUser(7)],
    },
    myCollection: {
      own: true,
      wishlist: false,
      wantToPlay: true,
    },
  },
};

function testUser(index: number) {
  return {
    id: `${index}`,
    name: `Testus ${index}`,
    realName: `Testy McTestface ${index}`,
    role: Role.USER,
    about: null,
    place: null,
    bggName: null,
    image: index % 3 === 0 ? null : "https://placehold.co/400",
  };
}
