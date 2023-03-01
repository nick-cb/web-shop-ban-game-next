import { Box, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import { AlphaTypo } from "./AlphaTypo";

const GameCard: React.FC<{ game: any }> = ({ game }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        borderRadius: "0.3rem",
        color: "text.primary",
      }}
      key={game._id}
    >
      <Link
        href={{
          pathname: `/product/${game.name.replace(/\s+/g, "-").toLowerCase()}`,
          query: { _id: game._id },
        }}
      >
        <Box className={"img-container"}>
          <img
            src={
              game.images.find((img: any) => {
                return img.type === "portrait";
              })?.url
            }
            style={{
              width: "100%",
              borderRadius: "0.3rem",
            }}
            loading="lazy"
            alt={game.name + "portrait"}
            className={"game-thumnail"}
          />
        </Box>
        <Typography
          className={"game-title"}
          sx={{ paddingTop: "0.9rem", color: "text.primary" }}
        >
          {game.name}
        </Typography>
        <AlphaTypo className={"text-small game-developer"}>
          {game.developer}
        </AlphaTypo>
        <Typography
          className={"game-price"}
          sx={{
            paddingTop: "0.6rem",
            color: "text.primary",
            textDecoration:
              game.discount_price && game.discount_price > 0 && "line-through",
          }}
        >
          ${game.sale_price}
        </Typography>
      </Link>
    </Box>
  );
};

export default GameCard;
