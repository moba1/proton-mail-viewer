{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  packages = [
    pkgs.nodejs_18
    pkgs.rpm
    pkgs.imagemagick
  ];
}
