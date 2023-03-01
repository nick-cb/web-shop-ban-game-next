import { AlphaButton } from "@/components/AlphaButton";
import { Box, Button } from "@mui/material";
import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import Email from "../../../../form/Email";
import Password from "../../../../form/Password";
import { useInputValidation } from "../../../../../hooks/useFormValidation";
import { API_URL } from "@/utils/config";

const EmailStrategy: React.FC<{ preview?: boolean }> = ({
  preview = false,
}) => {
  const [disabled, setDisabled] = useState(true);
  const [email, setEmail, emailValidation] = useInputValidation(null, {
    isEmail: true,
  });
  const [password, setPassword, passwordValidation] = useInputValidation();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) {
      return;
    }

    axios
      .post(`${API_URL}/api/users/login`, {
        email,
        password,
      })
      .then(({ status }) => {
        if (status === 200) {
          window.location.href = "/homepage";
        }
      });
    // const { token } = data;
    // if (token && values.setLoginToken) {
    //   values.setLoginToken(token);
    // }
  };

  useEffect(() => {
    if (
      emailValidation.false !== undefined &&
      passwordValidation.false !== undefined &&
      !emailValidation.false &&
      !passwordValidation.false
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [emailValidation.false, passwordValidation.false]);

  if (preview) {
    return <AlphaButton>Login by email</AlphaButton>;
  }

  return (
    <Box>
      <form
        id={"login-by-email-and-password-form"}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
        }}
        onSubmit={(e) => submitHandler(e)}
      >
        <Email setEmail={setEmail} emailValidation={emailValidation} />
        <Password
          setPassword={setPassword}
          passwordValidation={passwordValidation}
        />
        <Button
          type={"submit"}
          sx={{
            color: "text.primary",
            bgcolor: "info.main",
            fontFamily: "brutal-medium",
            fontSize: "0.75rem",
            width: "100%",
            padding: "0.9rem 0",
            marginTop: "0.9rem",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
          disabled={disabled}
        >
          Login
        </Button>
      </form>
    </Box>
  );
};

export default React.memo(EmailStrategy);
