import ENV from 'houseninja/config/environment';

const hnArt = `
████████████████████████████
█████▛▜████▀▘ ▗▟████████████
█████  ▛▀  ▄▟██▙▄  ▀▜███████   ██╗  ██╗ ██████╗ ██╗   ██╗███████╗███████╗    ███╗   ██╗██╗███╗   ██╗     ██╗ █████╗
█████  ▗▄██████████▄▖ ▝█████   ██║  ██║██╔═══██╗██║   ██║██╔════╝██╔════╝    ████╗  ██║██║████╗  ██║     ██║██╔══██╗
█████████████████████  █████   ███████║██║   ██║██║   ██║███████╗█████╗      ██╔██╗ ██║██║██╔██╗ ██║     ██║███████║
█████▘ ██████████████  █████   ██╔══██║██║   ██║██║   ██║╚════██║██╔══╝      ██║╚██╗██║██║██║╚██╗██║██   ██║██╔══██║
█████  ██████████████  █████   ██║  ██║╚██████╔╝╚██████╔╝███████║███████╗    ██║ ╚████║██║██║ ╚████║╚█████╔╝██║  ██║
█████  ██████████████  █████   ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝╚══════╝    ╚═╝  ╚═══╝╚═╝╚═╝  ╚═══╝ ╚════╝ ╚═╝  ╚═╝
█████▖                ▗█████
████████████████████████████
`;

// stub helper for tests
export const content = (env: string) => {
  if (env === 'test') {
    return;
  } else {
    return hnArt;
  }
};

export const initialize = () => {
  console.log(content(ENV.environment));
};

export default {
  initialize,
};
