import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

import { mode } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,

  styles: {
    global: (props: any) => ({
      body: {
        backgroundColor: mode("gray.100", "")(props),
        color: mode("black", "")(props),
      },
    }),
  },
});

export default theme;
