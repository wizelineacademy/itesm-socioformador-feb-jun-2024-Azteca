/// <reference path="./.sst/platform/config.d.ts" />
///No cambiar nada de este archivo, es el archivo de configuración de SST
//putazos al que lo haga
export default $config({
  app(input) {
    return {
      name: "myweb5-assets-2024-04-23",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },

  async run() {
    

    new sst.aws.Nextjs("MyWeb6", {
    });
  },
});
