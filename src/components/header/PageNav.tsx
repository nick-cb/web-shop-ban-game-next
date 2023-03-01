import { Container } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { AlphaTypo } from "../AlphaTypo";

const PageNav= () => {
  const { pathname } = useRouter();

  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        // border: "1px solid green",
        maxWidth: {
          lg: "80%",
        },
        padding: "1.2rem 0",
        gap: "1.2rem",
      }}
    >
      <Link href={"/"} style={{ cursor: "pointer" }}>
        <AlphaTypo
          sx={{
            transition: "color 150ms ease-in-out",
            "&:hover": {
              color: "text.primary",
            },
            color: pathname === ('/') ? "text.primary" : ""
          }}
        >
          Discover
        </AlphaTypo>
      </Link>
      <Link href={"/browse"}>
        <AlphaTypo
          sx={{
            transition: "color 150ms ease-in-out",
            "&:hover": { color: "text.primary" },
            color: pathname.includes("browse") ? "text.primary" : ""
          }}
        >
          Browse
        </AlphaTypo>
      </Link>
    </Container>
  );
};

export default PageNav;
