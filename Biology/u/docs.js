const lessonsData = {
  "Hệ Cơ Quan": {
    icon: "bx-dna",
    lessons: [
      { title: "Hệ Vận Động", file: "docs/hevd.md" },
      {
        title: "Chức năng tế bào",
        file: "docs/te-bao-hoc/chuc-nang-te-bao.md",
      },
      {
        title: "Phân chia tế bào",
        file: "docs/te-bao-hoc/phan-chia-te-bao.md",
      },
    ],
  },
  "Di truyền học": {
    icon: "bx-customize",
    lessons: [
      {
        title: "Định luật Mendel",
        file: "docs/di-truyen-hoc/dinh-luat-mendel.md",
      },
      { title: "ADN và RNA", file: "docs/di-truyen-hoc/adn-va-rna.md" },
      { title: "Đột biến gen", file: "docs/di-truyen-hoc/dot-bien-gen.md" },
    ],
  },
  "Sinh thái học": {
    icon: "bx-leaf",
    lessons: [
      { title: "Hệ sinh thái", file: "docs/sinh-thai-hoc/he-sinh-thai.md" },
      { title: "Chuỗi thức ăn", file: "docs/sinh-thai-hoc/chuoi-thuc-an.md" },
      {
        title: "Bảo vệ môi trường",
        file: "docs/sinh-thai-hoc/bao-ve-moi-truong.md",
      },
    ],
  },
  "Sinh lý học": {
    icon: "bx-heart",
    lessons: [
      { title: "Hệ tuần hoàn", file: "docs/sinh-ly-hoc/he-tuan-hoan.md" },
      { title: "Hệ hô hấp", file: "docs/sinh-ly-hoc/he-ho-hap.md" },
      { title: "Hệ tiêu hóa", file: "docs/sinh-ly-hoc/he-tieu-hoa.md" },
    ],
  },
};


const quizLinksFile = "quiz-links.json";

async function loadMarkdownFile(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Không thể tải file: ${filePath}`);
    }
    const content = await response.text();
    return content;
  } catch (error) {
    console.error("Error loading markdown:", error);
    return `# Lỗi tải file\n\nKhông thể tải nội dung từ: **${filePath}**\n\nVui lòng kiểm tra:\n- File có tồn tại không?\n- Đường dẫn có chính xác không?\n- Server có đang chạy không?`;
  }
}


async function loadQuizLinks() {
  try {
    const response = await fetch(quizLinksFile);
    if (!response.ok) {
      throw new Error("Không thể tải danh sách quiz");
    }
    quizLinks = await response.json();
  } catch (error) {
    console.error("Error loading quiz links:", error);

    quizLinks = [
      { title: "Tế bào học - Quiz 1", url: "https://humainbio.vercel.app/" },
      { title: "Di truyền học - Quiz 1", url: "https://example.com/quiz2" },
      { title: "Sinh thái học - Quiz 1", url: "https://example.com/quiz3" },
    ];
  }
}

let currentLesson = null;
let allLessons = [];
let quizLinks = [];
let currentView = "lessons"; 

function initMenu() {
  const container = document.getElementById("menuContainer");
  container.innerHTML = "";


  const modeSwitcher = document.createElement("div");
  modeSwitcher.className = "mb-4 flex gap-2 justify-center";
  modeSwitcher.innerHTML = `
  <button 
      id="btnLessons" 
      class="mode-btn active"
      onclick="switchToLessons()"
      title="Lý thuyết"
  >
      <i class='bx bx-book-open'></i>
  </button>

  <button 
      id="btnQuiz" 
      class="mode-btn"
      onclick="switchToQuiz()"
      title="Trắc nghiệm"
  >
      <i class='bx bx-edit'></i>
  </button>

  <a 
      href="./biograph.html" 
      class="mode-btn"
      id="btnBio"
      title="Sinh học số"
  >
      <i class='bx bx-child' style = 'font-size:40px'></i> 
  </a>
`;

  container.appendChild(modeSwitcher);


  const contentDiv = document.createElement("div");
  contentDiv.id = "menuContent";
  container.appendChild(contentDiv);

  renderLessonsMenu();
}


function renderLessonsMenu() {
  const contentDiv = document.getElementById("menuContent");
  contentDiv.innerHTML = "";

  Object.keys(lessonsData).forEach((folder) => {
    const folderData = lessonsData[folder];
    const folderId = folder.replace(/\s+/g, "-");

    const folderDiv = document.createElement("div");
    folderDiv.className = "mb-2";
    folderDiv.innerHTML = `
                    <div class="folder-item flex items-center gap-2" onclick="toggleFolder('${folderId}')">
                        <i class='bx bx-chevron-right folder-toggle text-xl' id="toggle-${folderId}"></i>
                        <i class='bx ${folderData.icon} text-xl'></i>
                        <span class="flex-1">${folder}</span>
                        <span class="text-xs px-2 py-1 rounded-full" style="background: var(--ctp-surface0); color: var(--ctp-subtext1)">
                            ${folderData.lessons.length}
                        </span>
                    </div>
                    <div class="nested-items ml-4" id="folder-${folderId}">
                        ${folderData.lessons
                          .map(
                            (lesson) => `
                            <div class="menu-item flex items-center gap-2" onclick="loadLesson('${lesson.file}', '${lesson.title}', '${folder}')">
                                <i class='bx bx-file text-lg'></i>
                                <span>${lesson.title}</span>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                `;
    contentDiv.appendChild(folderDiv);


    folderData.lessons.forEach((lesson) => {
      allLessons.push({ ...lesson, folder });
    });
  });
}

function renderQuizMenu() {
  const contentDiv = document.getElementById("menuContent");
  contentDiv.innerHTML = "";

  if (quizLinks.length === 0) {
    contentDiv.innerHTML = `
                    <div class="text-center py-8" style="color: var(--ctp-subtext1)">
                        <i class='bx bx-error text-4xl mb-2'></i>
                        <p>Chưa có bài trắc nghiệm</p>
                    </div>
                `;
    return;
  }

  quizLinks.forEach((quiz, index) => {
    const quizDiv = document.createElement("div");
    quizDiv.className = "menu-item flex items-center gap-2";
    quizDiv.onclick = () => loadQuiz(quiz.url, quiz.title);
    quizDiv.innerHTML = `
                    <i class='bx bx-edit text-lg'></i>
                    <span>${quiz.title}</span>
                `;
    contentDiv.appendChild(quizDiv);
  });
}


function switchToLessons() {
  currentView = "lessons";
  document.getElementById("btnLessons").classList.add("active");
  document.getElementById("btnQuiz").classList.remove("active");
  document.getElementById("searchContainer").style.display = "block";
  renderLessonsMenu();
  showDefaultContent();
}


function switchToQuiz() {
  currentView = "quiz";
  document.getElementById("btnQuiz").classList.add("active");
  document.getElementById("btnLessons").classList.remove("active");
  document.getElementById("searchContainer").style.display = "none";
  renderQuizMenu();
  showQuizIntro();
}


function showDefaultContent() {
  document.getElementById("titleText").textContent =
    "Chào mừng đến với Sinh Học!";
  document.getElementById("subtitleText").textContent =
    "Chọn một bài học từ menu bên trái để bắt đầu";
  document.getElementById("contentArea").innerHTML = `
                <div class="text-center py-20">
                    <i class='bx bx-book-open text-8xl mb-4' style="color: var(--ctp-pink); opacity: 0.3;"></i>
                    <p class="text-xl" style="color: var(--ctp-subtext1)">Hãy chọn một chủ đề để bắt đầu học</p>
                </div>
            `;
}


function showQuizIntro() {
  document.getElementById("titleText").textContent = "Trắc nghiệm Sinh Học";
  document.getElementById("subtitleText").textContent =
    "Chọn một bài kiểm tra để bắt đầu";
  document.getElementById("contentArea").innerHTML = `
                <div class="text-center py-20">
                    <i class='bx bx-edit text-8xl mb-4' style="color: var(--ctp-flamingo); opacity: 0.3;"></i>
                    <p class="text-xl" style="color: var(--ctp-subtext1)">Chọn một bài trắc nghiệm từ menu bên trái</p>
                </div>
            `;
}


function loadQuiz(url, title) {
  if (window.innerWidth <= 768) {
    closeMobileMenu();
  }

  document.getElementById("titleText").textContent = title;
  document.getElementById("subtitleText").textContent = "Bài trắc nghiệm";

  document.querySelectorAll(".menu-item").forEach((item) => {
    item.classList.remove("active");
  });


  event.currentTarget.classList.add("active");


  document.getElementById("contentArea").innerHTML = `
                <iframe 
                    src="${url}" 
                    style="width: 100%; height: calc(100vh - 180px); border: none; border-radius: 12px;"
                    frameborder="0"
                    allowfullscreen
                ></iframe>
            `;
}


function toggleFolder(folderId) {
  const folder = document.getElementById(`folder-${folderId}`);
  const toggle = document.getElementById(`toggle-${folderId}`);
  folder.classList.toggle("open");
  toggle.classList.toggle("open");
}


async function loadLesson(file, title, folder) {
  currentLesson = file;

  if (window.innerWidth <= 768) {
    closeMobileMenu();
  }


  document.getElementById("titleText").textContent = title;
  document.getElementById("subtitleText").textContent = folder;


  document.querySelectorAll(".menu-item").forEach((item) => {
    item.classList.remove("active");
  });


  event.currentTarget.classList.add("active");

  document.getElementById("contentArea").innerHTML = `
                <div class="text-center py-20">
                    <i class='bx bx-loader-alt bx-spin text-8xl mb-4' style="color: var(--ctp-pink)"></i>
                    <p class="text-xl" style="color: var(--ctp-subtext1)">Đang tải nội dung...</p>
                </div>
            `;


  const content = await loadMarkdownFile(file);
  const html = marked.parse(content);
  document.getElementById("contentArea").innerHTML = html;


  document.querySelector(".content-area").scrollTop = 0;
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();

  if (query === "") {

    document.querySelectorAll(".menu-item, .folder-item").forEach((item) => {
      item.style.display = "";
    });
    document.querySelectorAll(".nested-items").forEach((items) => {
      items.classList.remove("open");
    });
    document.querySelectorAll(".folder-toggle").forEach((toggle) => {
      toggle.classList.remove("open");
    });
    return;
  }


  Object.keys(lessonsData).forEach((folder) => {
    const folderId = folder.replace(/\s+/g, "-");
    const folderEl = document.getElementById(`folder-${folderId}`);
    const toggleEl = document.getElementById(`toggle-${folderId}`);
    let hasVisibleLesson = false;

    lessonsData[folder].lessons.forEach((lesson, index) => {
      const lessonEl = folderEl.children[index];
      if (
        lesson.title.toLowerCase().includes(query) ||
        folder.toLowerCase().includes(query)
      ) {
        lessonEl.style.display = "";
        hasVisibleLesson = true;
      } else {
        lessonEl.style.display = "none";
      }
    });

    if (hasVisibleLesson) {
      folderEl.classList.add("open");
      toggleEl.classList.add("open");
    } else {
      folderEl.classList.remove("open");
      toggleEl.classList.remove("open");
    }
  });
});


async function init() {
  await loadQuizLinks();
  initMenu();
}


function toggleMobileMenu() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("mobileOverlay");
  sidebar.classList.toggle("mobile-open");
  overlay.classList.toggle("active");
}

function closeMobileMenu() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("mobileOverlay");
  sidebar.classList.remove("mobile-open");
  overlay.classList.remove("active");
}

init();


const iconContainer = document.getElementById("icon-container");
const titleBox = document.getElementById("title-box");


const iconsList = ["🧠", "🫀", "🧬", "🦴", "🦠", "🧪", "🔬", "🦋", "🍎", "🍄"];
const numIcons = 20;
const activeIcons = [];

function createIcon() {
  const icon = document.createElement("span");
  icon.classList.add("icon");
  icon.innerHTML = iconsList[Math.floor(Math.random() * iconsList.length)];


  icon.speed = 0.5 + Math.random() * 1.5;
  icon.bounce = Math.random() * 20 + 5;
  icon.translateX = Math.random() * 0.5 - 0.25;
  icon.rotation = Math.random() * 360;
  icon.rotateSpeed = Math.random() * 0.3 - 0.15;

  icon.dataset.top = Math.random() * titleBox.clientHeight;
  icon.dataset.left = Math.random() * titleBox.clientWidth;

  iconContainer.appendChild(icon);
  return icon;
}


for (let i = 0; i < numIcons; i++) {
  const icon = createIcon();
  activeIcons.push(icon);
}


function animateBoxRain() {
  const boxHeight = titleBox.clientHeight;
  const boxWidth = titleBox.clientWidth;

  activeIcons.forEach((icon) => {
    let currentTop = parseFloat(icon.dataset.top);
    let currentLeft = parseFloat(icon.dataset.left);

    currentTop += icon.speed;

    currentLeft += icon.translateX * Math.sin(currentTop / icon.bounce);


    icon.rotation += icon.rotateSpeed;


    icon.style.transform = `translate(${currentLeft}px, ${currentTop}px) rotate(${icon.rotation}deg)`;
    icon.style.opacity = 0.8;


    icon.dataset.top = currentTop;
    icon.dataset.left = currentLeft;


    if (currentTop > boxHeight) {
      currentTop = -10; 

      icon.dataset.top = currentTop;
      icon.dataset.left = Math.random() * boxWidth;
      icon.speed = 0.5 + Math.random() * 1.5;
    }
  });

  requestAnimationFrame(animateBoxRain);
}


window.addEventListener("load", () => {

  animateBoxRain();
});
