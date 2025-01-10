document.addEventListener("DOMContentLoaded", function () {
    // '닫기' 버튼 (첫 번째, 두 번째)
    const firstCloseButton = document.querySelectorAll('.goods-close-button')[0];
    const secondCloseButton = document.querySelectorAll('.goods-close-button')[1];

    document.querySelectorAll('.goods-close-button').forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
        });
    });

    // 첫 번째 버튼: 7, 15, 21번째 div 토글
    if (firstCloseButton) {
        firstCloseButton.addEventListener('click', function () {
            const targetDivs = [
                document.querySelectorAll('.goods-guide-change2')[0],
                document.querySelectorAll('.goods-guide-change2')[1],
                document.querySelectorAll('.goods-guide-change2')[2]
            ];

            targetDivs.forEach(div => div.classList.toggle('hidden'));

            if (firstCloseButton.textContent.trim() === "닫기") {
                firstCloseButton.textContent = "자세히보기";
                firstCloseButton.classList.replace('arrow-up', 'arrow-down');
            } else {
                firstCloseButton.textContent = "닫기";
                firstCloseButton.classList.replace('arrow-down', 'arrow-up');
            }
        });
    }

    // 두 번째 버튼: 33, 42번째 div 토글
    if (secondCloseButton) {
        secondCloseButton.addEventListener('click', function () {
            const targetDivs = [
                document.querySelectorAll('.goods-guide-change2')[3],
                document.querySelectorAll('.goods-guide-change2')[4]
            ];

            targetDivs.forEach(div => div.classList.toggle('hidden'));

            if (secondCloseButton.textContent.trim() === "닫기") {
                secondCloseButton.textContent = "자세히보기";
                secondCloseButton.classList.replace('arrow-up', 'arrow-down');
            } else {
                secondCloseButton.textContent = "닫기";
                secondCloseButton.classList.replace('arrow-down', 'arrow-up');
            }
        });
    }

    // 스크롤 이벤트
    window.addEventListener('scroll', function () {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.goods-nav-a');

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop - sectionHeight / 3) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        sections.forEach(section => {
            if (section.getAttribute('id') === currentSection) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    });

    // 부드럽게 스크롤 이동
    document.querySelectorAll('.goods-nav-a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });

            document.querySelectorAll('.goods-nav-a').forEach(item => item.classList.remove('active'));
            link.classList.add('active');

            document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
            targetElement.classList.add('active');
        });
    });

    // 공지 버튼
    const buttons = document.querySelectorAll(".goods-notification-button");
    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const targetElement = button.parentElement.nextElementSibling;

            if (targetElement && targetElement.tagName.toLowerCase() === "p") {
                targetElement.style.display = targetElement.style.display === "block" ? "none" : "block";
            }
        });
    });

    const deleteButtons = document.querySelectorAll('.review-delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const reviewIndex = button.getAttribute('data-index');
            if (!reviewIndex) {
                alert("잘못된 요청입니다.");
                return;
            }

            if (confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
                const xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            const response = JSON.parse(xhr.responseText);
                            if (response.result === 'success') {
                                alert('리뷰가 삭제되었습니다.');
                                button.closest('.goods-review-member').style.display = 'none';
                            } else {
                                alert('리뷰 삭제에 실패했습니다.');
                            }
                        } else {
                            alert('삭제에 실패했습니다.');
                        }
                    }
                };
                xhr.open('DELETE', `/kurly/delete?index=${reviewIndex}`);
                xhr.send();
            }
        });
    });
});

function openModal(button) {
    const imageSrc = button.getAttribute('data-image-src');
    const writer = button.getAttribute('data-writer');
    const title = button.getAttribute('data-title');
    const content = button.getAttribute('data-content');
    const createdAt = button.getAttribute('data-createdAt');

    // 모달창에 데이터 삽입
    document.getElementById('modalImage').src = imageSrc;
    document.getElementById('modal-writer').textContent = writer;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-content').textContent = content;
    document.getElementById('modal-createdAt').textContent = createdAt;

    // 모달 열기
    document.getElementById('reviewModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('reviewModal').style.display = 'none';
}