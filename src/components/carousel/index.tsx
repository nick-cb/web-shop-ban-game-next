import { alpha, Box, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { getCollections } from "../category";
import { useAnimationFrame } from "../../hooks/useAnimationFrame";
import StackSkeleton from "./skeletons/StackSkeleton";

const Carousel = () => {
  const stackRef = useRef<any>(null);
  const gameCarouselRef = useRef<HTMLUListElement>(null);
  const [topsale, setTopsale] = useState<any[] | null>(null);
  const transitionDelay = 5000;
  const [currentItem, setCurrentItem] = useState(1);

  useEffect(() => {
    getCollections(["top sale"]).then((data) => {
      const spliced = data[0]?.list_game.splice(1, 6);
      spliced?.forEach((game: any) => {
        game.images = game.images.find((img: any) => {
          return img.type === "landscape";
        });
      });
      setTopsale(spliced);
    });
  }, []);

  useEffect(() => {
    if (stackRef.current) {
      if (stackRef.current.style.flexDirection === "row") return;
      const stackItems = stackRef.current.querySelectorAll(
        ".carousel-stack-item"
      );
      const stackItemArr = Array.from(stackItems);
      stackItemArr.forEach((item: any) => {
        item.style.height = `${100 / stackItemArr.length}%`;
      });
    }
  }, [stackRef, topsale]);

  useEffect(() => {
    if (currentItem === 1) {
      const stackItems = stackRef.current.querySelectorAll(
        ".carousel-stack-item"
      );
      const stackItemArr = Array.from(stackItems);
      if (stackItemArr && stackItems.length > 1) {
        const cover =
          // @ts-ignore
          stackItemArr[currentItem - 1]?.querySelector(".cover");
        if (cover) {
          cover.style.transition = `width 5s cubic-bezier(0.17, 0.17, 0.23, 1.00)`;
          cover.style.width = "100%";
        }
      }
    }
  }, [currentItem]);

  const carouselTransition = () => {
    if (gameCarouselRef.current) {
      const reset = gameCarouselRef.current.querySelectorAll("li").length;
      const stackItems = stackRef.current.querySelectorAll(
        ".carousel-stack-item"
      );
      const stackItemArr = Array.from(stackItems);
      if (currentItem !== reset) {
        const cover =
          // @ts-ignore
          stackItemArr[currentItem]?.querySelector(".cover");
        // @ts-ignore
        const img = stackItemArr[currentItem]?.querySelector(
          ".stack-img-container"
        );
        img?.animate(
          [
            { transform: `scale(1)` },
            { transform: `scale(1.1)` },
            { transform: `scale(1)` },
          ],
          {
            duration: 500,
            fill: "forwards",
            easing: "cubic-bezier(0.33, 0.00, 0.67, 1.00)",
          }
        );
        // img.style.transition = `all 200s cubic-bezier(0.33, 0.00, 0.67, 1.00)`;
        if (cover) {
          cover.style.transition = `width 5s linear`;
          cover.style.width = "100%";
        }
        gameCarouselRef.current.style.transition = "1.5s ease-in-out";
        gameCarouselRef.current.style.transform = `translateX(-${
          100 * currentItem
        }%)`;
        return setCurrentItem((c: number) => c + 1);
      } else {
        const covers = Array.from(stackRef.current.querySelectorAll(".cover"));
        for (let index = 0; index < covers.length; index++) {
          const item = covers[index];
          // @ts-ignore
          item.style.width = 0;
          // @ts-ignore
          item.style.transition = null;
        }

        gameCarouselRef.current.style.transition = "1s ease-in-out";
        gameCarouselRef.current.style.transform = `translateX(${0}%)`;
        return setCurrentItem(1);
      }
    }
  };

  useAnimationFrame(transitionDelay, carouselTransition);

  return (
    <Box
      className={"carousel"}
      sx={{
        display: "flex",
        gap: "0.9rem",
        flexDirection: { xs: "column", md: "row" },
        padding: "1.5rem 0",
        marginBottom: "0.9rem",
        position: "relative",
      }}
    >
      {topsale ? (
        <Box borderRadius={"0.6rem"} sx={{ overflow: "hidden", width: "85%" }}>
          <ul
            ref={gameCarouselRef}
            style={{
              display: "flex",
              listStyle: "none",
              maxHeight: "480px",
            }}
          >
            {topsale.map((game: any, index: number) => {
              return (
                <li
                  key={"img" + index}
                  style={{
                    flexBasis: "100%",
                    flexShrink: 0,
                    padding: "0 0.3rem",
                    width: "100%",
                    // position: "absolute",
                    // zIndex: -1,
                  }}
                >
                  <img
                    src={game.images.url}
                    alt={`data.name + "landscape"`}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "0.6rem",
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </Box>
      ) : (
        <Skeleton
          variant="rectangular"
          sx={{ bgcolor: "background.paper" }}
          width="85%"
          height={480}
        />
      )}
      <Stack
        ref={stackRef}
        gap={"0.6rem"}
        sx={{
          flexDirection: { xs: "row", md: "column" },
          width: { sm: "100%", md: "15%" },
          listStyle: "none",
        }}
      >
        {topsale ? (
          topsale.map((game: any, index: number) => (
            <Paper
              key={index}
              className={"carousel-stack-item"}
              elevation={0}
              sx={{
                padding: "0.6rem",
                borderRadius: "0.6rem",
                position: "relative",
                overflow: "hidden",
                bgcolor: {
                  md:
                    currentItem === index + 1
                      ? "background.paper"
                      : "background.default",
                },
                display: "flex",
                alignItems: { sx: "stretch", md: "center" },
                gap: "0.6rem",
                width: { xs: "100%", md: "unset" },
              }}
            >
              <Box
                className="stack-img-container"
                sx={{
                  width: { xs: "100%", md: "25%" },
                  height: "100%",
                  borderRadius: "0.6rem",
                  display: { xs: "none", md: "block" },
                }}
              >
                <img
                  src={game.images.url}
                  alt={""}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "0.6rem",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  display: { xs: "none", md: "block" },
                  width: { xs: "0%", md: "70%" },
                  fontSize: "0.75rem !important",
                }}
              >
                {game.name}
              </Typography>
              <Box
                className={"cover"}
                sx={{
                  width: "0%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  backgroundColor: (theme) =>
                    alpha(
                      theme.palette.text.primary,
                      currentItem === index + 1 ? 0.1 : 0
                    ),
                }}
              />
            </Paper>
          ))
        ) : (
          <StackSkeleton />
        )}
      </Stack>
    </Box>
  );
};

export default Carousel;
