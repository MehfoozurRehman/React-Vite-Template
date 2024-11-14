import { execSync } from "child_process";
import fs from "fs/promises";

const publish = async () => {
  try {
    const packageJson = await fs.readFile("package.json", "utf8");
    const packageJsonData = JSON.parse(packageJson);
    const currentVersion = packageJsonData.version;
    const versionParts = currentVersion.split(".");
    versionParts[2] = parseInt(versionParts[2]) + 1;
    const newVersion = versionParts.join(".");
    packageJsonData.version = newVersion;
    await fs.writeFile(
      "package.json",
      JSON.stringify(packageJsonData, null, 2),
      "utf8"
    );

    execSync("git add .");
    execSync(`git commit -m "chore: bump version to ${newVersion}"`);
    execSync(`git tag -a v${newVersion} -m "v${newVersion}"`);
    execSync("git push");

    execSync("npm publish");

    console.log("Published successfully");
  } catch (error) {
    console.error(error);
  }
};

publish();
