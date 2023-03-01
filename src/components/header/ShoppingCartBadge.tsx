import { Badge, Box, IconButton, styled } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CartPopover } from "./CartPopover";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { GlobalContext } from "../../pages/_app";
import axios from "axios";
import { useClickOutside } from "../../hooks/useClickoutside";
import { useRouter } from "next/router";
import { API_URL } from "@/utils/config";

export const CartBadge = styled(Badge)(({ theme }) => ({
  ".MuiBadge-badge": {
    right: 0,
    top: 0,
    border: `2px solid ${theme.palette.common.black} !important`,
    padding: "0 4px",
  },
}));

const getCart = async (route: string, loginToken: string): Promise<any> => {
  return await axios
    .get(route, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    })
    .then(({ data }) => {
      return data;
      // setCount(data.count);
    })
    .catch((error) => {
      return null;
    });
};

const ShoppingCartBadge = () => {
  const guestCart = useRef(false);
  const [count, setCount] = useState(0);
  const [addedProduct, setAddedProduct] = useState(null);
  const [visible, setVisible, cartPopRef] = useClickOutside(false);
  const router = useRouter();

  const value = useContext(GlobalContext);
  const { loginToken } = value;

  const fetchCount = React.useCallback(
    async (loginToken: any, openDialog = false, product = null) => {
      if (product) {
        setAddedProduct(product);
      }
      let localCount: number | null = null;
      console.log(guestCart.current);
      if (loginToken && !guestCart.current) {
        const userCount = await getCart(
          `${API_URL}/api/carts/auth/count`,
          loginToken
        );

        localCount = userCount.count;
      } else {
        const data = await getCart(
          `${API_URL}/api/carts/count`,
          ""
        ).catch((error) => error);
        if (data && data.count) {
          guestCart.current = true;
          localCount = data.count;
        }
      }
      setCount(localCount!);
      if (openDialog) {
        setVisible(true);
      }
    },
    [setVisible]
  );

  // TODO: Need a better way to do this because it not update live
  value.fetchCount = fetchCount;

  useEffect(() => {
    (async () => {
      if (loginToken && guestCart.current) {
        await axios.get(`${API_URL}/api/carts/auth/update`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${loginToken}` },
        });
        guestCart.current = false;
      }
    })().then(() => {
      fetchCount(loginToken);
    });
  }, [fetchCount, loginToken]);
  useEffect(() => {
    const { pathname } = router;

    if (!pathname.includes("product")) {
      setVisible(false);
    }
  });

  return (
    <Box sx={{ ml: 2, position: "relative" }}>
      <IconButton
        size="small"
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={() => {
          router.push("/cart");
        }}
      >
        {count > 0 ? (
          <CartBadge badgeContent={count} color={"primary"}>
            <ShoppingCartIcon fontSize={"small"} />
          </CartBadge>
        ) : (
          <ShoppingCartIcon fontSize={"small"} />
        )}
      </IconButton>
      {visible && (
        <CartPopover cartPopRef={cartPopRef} product={addedProduct} />
      )}
    </Box>
  );
};

export default ShoppingCartBadge;
