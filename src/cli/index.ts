#!/usr/bin/env node
import { exec } from "child_process";
import inquirer from "inquirer";
import { DEFAULT_APP_NAME } from "../consts.js";
import ora from "ora";
import gradient from "gradient-string";
import figlet from "figlet";
import fs from "fs";

let _repoName: string;
let spineer: any;

async function getDirName() {
  const answers = await inquirer.prompt({
    name: "repo_name",
    type: "input",
    message: "Enter the name of repo",
    default() {
      return DEFAULT_APP_NAME;
    },
  });
  if (fs.existsSync(answers.repo_name)) {
    console.error("folder already exists");

    process.exit(1);
  } else {
    _repoName = answers.repo_name;
  }
}

async function createRepo() {
  spineer = ora("Creating repo...").start();
  exec(
    `cd .. && git clone https://github.com/scaffold-eth/scaffold-eth-2.git ${_repoName} && cd se2 && rm -rf .git`,
    (err, stdout, stderr) => {
      if (err) {
        spineer.stop("Repo creation failed");
        return;
      }
      if (stdout) {
        console.log("stdout: ", stdout);
      }
      if (stderr) {
        spineer.succeed("scafold-eth app created succesfully");
        installingPackages();
      }
    }
  );
}

async function installingPackages() {
  const answers = await inquirer.prompt({
    name: "install_packages",
    type: "confirm",
    message: "Do you want to install packages?",
    default() {
      return true;
    },
  });
  if (answers.install_packages) {
    ora("intalling packages..").start();
    await exec(`cd .. && cd ${_repoName} && yarn`, (err, stdout, stderr) => {
      if (err) {
        ora("Package installation failed").stop();
      }
      if (stdout) {
        ora().succeed("Packages installed succesfully");
        figlet("Hacking SE 2", (err, data) => {
          console.log(gradient.pastel.multiline(data));
          if (err) {
            console.log(err);
          }
          process.exit(0);
        });
      }
      if (stderr) {
        console.log("stderr: ", stderr);
      }
    });
  } else {
    figlet("Hacking SE 2", (err, data) => {
      console.log(gradient.pastel.multiline(data));
      if (err) {
        console.log(err);
      }
      process.exit(0);
    });
  }
}

await getDirName();
await createRepo();
