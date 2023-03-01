import { alpha, Box, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import GameType from "../../components/GameType";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GameCarousel from "../../components/product/GameCarousel";
import AddToCartControl from "../../components/product/AddToCartControl";
import BasicInfo from "../../components/product/BasicInfo";
import WishlistButton from "../../components/product/WishlistButton";
import Description from "../../components/product/Description";
import GameCard from "../../components/product/GameCard";
import Review from "../../components/product/Review";
import { AlphaTypo } from "../../components/AlphaTypo";
import ProductSkeleton from "../../components/product/skeletons/ProductSkeleton";
import { useRouter } from "next/router";
import { API_URL } from "@/utils/config";

const Product: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [includes, setIncludes] = useState<any>(null);
  const [includedIn, setIncludedIn] = useState<any>();

  const {query} = useRouter();

  useEffect(() => {
    let _id: string;
    if (query && query._id) {
      _id = query._id.toString();
    }

    const fetchData = async () => {
      const { data } = await axios.get(`${API_URL}/api/products/games/${_id}`);
      const { includes, included_in, ...rest } = data;
      setIncludes(includes);
      setIncludedIn(included_in);
      setData(rest);
    };
    fetchData();
  }, [query]);

  useEffect(() => {
    if (!data) {
      return;
    }
    let section = "";

    if (query && query.section) {
      section = query.section.toString();
    }
    if (section === "") {
      return;
    }

    document.querySelector(`#${section}`)?.scrollIntoView();
    query.section = "";
  }, [query, data]);

  return (
    <>
      {data ? (
        <Box>
          <Box
            className={"product-page"}
            sx={{
              padding: "1.5rem 0",
              color: "text.primary",
              paddingBottom: "3.9rem",
            }}
          >
            <Typography variant={"h1"} sx={{ paddingBottom: "1.5rem" }}>
              {data.name}
            </Typography>
            <Box
              className={"game-content"}
              sx={{
                display: { xs: "flex", md: "grid" },
                gap: "2.8rem",
                flexDirection: "column",
                alignItems: "flex-start",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "auto",
              }}
            >
              <Box
                sx={{
                  gridRow: "1/2",
                  gridColumn: "1/3",
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    // width: { xs: "100%", md: "70%" },
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  <GameCarousel data={data} />
                  <Typography sx={{ fontSize: "1rem !important" }}>
                    {data.title}
                  </Typography>
                  <Box
                    sx={{
                      borderLeft: "1px solid",
                      borderColor: (theme) =>
                        alpha(theme.palette.text.primary, 0.3),
                      padding: "0.9rem 1.2rem",
                    }}
                  >
                    <AlphaTypo >
                      Genres
                    </AlphaTypo>
                    <Typography>
                      {data.tag.map((tag: any, index: number) => (
                        <span key={tag}>
                          {tag.substring(0, 1).toUpperCase() +
                            tag.substring(1, tag.length)}
                          {index < data.tag.length - 1 && ", "}{" "}
                        </span>
                      ))}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  gridRow: "1/3",
                  gridColumn: "3/4",
                  width: "100%",
                }}
              >
                <Box
                  className={"game-controls"}
                  sx={{
                    // width: { xs: "100%", md: "30%" },
                    fontFamily: "brutal-regular",
                  }}
                >
                  <Box
                    sx={{
                      display: { xs: "none", md: "block" },
                      padding: "1.2rem",
                    }}
                  >
                    <img
                      src={
                        data.images.find((img: any) => {
                          return img.type === "logo";
                        })?.url
                      }
                      alt={data.name + "logo"}
                      style={{ width: "100%" }}
                    />
                  </Box>
                  <Box
                    sx={{
                      marginTop: "1.2rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.6rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <GameType type={"Base Game"} />
                    <Typography>${data.sale_price}</Typography>
                    <AddToCartControl data={data} />
                    <WishlistButton
                      className={"wishlist-btn"}
                      sx={{ width: "100%" }}
                    >
                      <AddCircleOutlineIcon sx={{ paddingRight: "0.3rem" }} />
                      Add to wishlist
                    </WishlistButton>
                    <BasicInfo data={data} />
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  gridRow: "2/3",
                  gridColumn: "1/3",
                }}
              >
                <Box
                  sx={{
                    color: "text.primary",
                    width: { xs: "100%", md: "100%" },
                  }}
                >
                  <Box
                    sx={{
                      "& h1": {
                        fontSize: "0.938rem !important",
                        paddingBottom: 1,
                      },
                      "& h2, h3, h4": {
                        fontSize: "0.938rem !important",
                      },
                      "& p, ul": {
                        fontSize: "0.875rem",
                        color: (theme) =>
                          alpha(theme.palette.text.secondary, 0.6),
                        paddingBottom: 3,
                      },
                      "& ul": {
                        ml: "15px",
                      },
                    }}
                  >
                    <Description description={data.description} />
                  </Box>
                  {includedIn && includedIn.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.2rem",
                        marginBottom: "3rem",
                      }}
                    >
                      <>
                        <Typography
                          variant={"h1"}
                          sx={{ fontFamily: "brutal-regular" }}
                        >
                          Editions
                        </Typography>
                        {includedIn.map((game: any) => (
                          <GameCard game={game} key={game._id} />
                        ))}
                      </>
                    </Box>
                  )}
                  {includes && includes.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.2rem",
                      }}
                    >
                      <>
                        <Typography
                          variant={"h1"}
                          sx={{ fontFamily: "brutal-regular" }}
                        >
                          Add-Ons
                        </Typography>
                        {includes.map((game: any) => (
                          <GameCard game={game} key={game._id} />
                        ))}
                      </>
                    </Box>
                  )}
                  <Review gameId={data._id} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <ProductSkeleton />
      )}
    </>
  );
};

export default Product;
