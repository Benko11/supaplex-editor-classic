const supaplexFile = document.querySelector(
  "#supaplex-file"
) as HTMLInputElement;
const level = document.querySelector("#level") as HTMLDivElement;
const nextBtn = document.querySelector("#next-btn") as HTMLButtonElement;
const backBtn = document.querySelector("#back-btn") as HTMLButtonElement;

nextBtn.addEventListener("click", () => {
  const newLevel = getId() + 1 > 111 ? 1 : getId() + 1;
  history.pushState("gay sex", "Supaplex Editor", `/?id=${newLevel}`);
  renderLevel(newLevel);
});

backBtn.addEventListener("click", () => {
  history.pushState("gay sex", "Supaplex Editor", `/?id=${getId() - 1}`);
  renderLevel(getId());
});

onbeforeunload = () => {
  return "Are you sure you want to leave with unsaved changes?";
};
let spFile: File;

supaplexFile.addEventListener("change", async (e: Event) => {
  const target = e.target as HTMLInputElement;

  if (target.files == null || target.files?.length < 1) return;

  spFile = target.files[0];
  renderLevel(getId());
});

function convertByte(byte: number) {
  let convert = byte.toString(16);
  if (convert.length < 2) convert = "0" + convert;
  return convert;
}

function processLevelData(data: Uint8Array, level: number) {
  if (level < 1) throw new Error("Invalid level number");

  const levelSize = 1440 + 96;
  const startIndex = (level - 1) * levelSize;
  const chunk = [...data.slice(startIndex, startIndex + levelSize)];
  const bytes = chunk.map((c) => convertByte(c));

  return [bytes.slice(0, 1440), bytes.slice(1440)];
}

function getId() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  if (id == null) return 1;
  return parseInt(id);
}

function processFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = (err) => {
      reject(err);
    };
  });
}

async function renderLevel(levelNumber: number) {
  level.innerHTML = "";

  const [levelBytes, levelInfo] = processLevelData(
    new Uint8Array((await processFile(spFile)) as ArrayBufferLike),
    levelNumber
  );
  levelBytes.forEach((lb) => {
    const image = new Image(32, 32);
    image.src = `/assets/${lb}.png`;
    level.appendChild(image);
  });
}
