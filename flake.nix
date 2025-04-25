{
  description = "typescript with pnpm";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "systems";
    flake-utils = {
      url = "flake-utils";
      inputs.systems.follows = "systems";
    };
  };

  outputs = { self, flake-utils, nixpkgs, ... }@inputs:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShells.default = pkgs.mkShell {
        packages = [
            pkgs.nodejs_20
            pkgs.nodePackages.pnpm
            pkgs.nodePackages.typescript
            pkgs.nodePackages.typescript-language-server
            pkgs.ruff
        ];
      };
    });
}

