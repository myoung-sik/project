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

    // 하트 버튼
    const heartButton = document.getElementById('heartButton');
    const heartIcon = document.getElementById('heartIcon');

    heartButton.addEventListener('click', function () {
        // 현재 하트 아이콘이 빨간색인지를 확인
        if (heartIcon.classList.contains('filled')) {
            // 빨간 하트를 기본 하트로 변경
            heartIcon.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0yNS44MDcgNy44NjNhNS43NzcgNS43NzcgMCAwIDAtOC4xNzIgMEwxNiA5LjQ5N2wtMS42MzUtMS42MzRhNS43NzkgNS43NzkgMCAxIDAtOC4xNzMgOC4xNzJsMS42MzQgMS42MzQgNy40NjYgNy40NjdhMSAxIDAgMCAwIDEuNDE1IDBzMCAwIDAgMGw3LjQ2Ni03LjQ2N2gwbDEuNjM0LTEuNjM0YTUuNzc3IDUuNzc3IDAgMCAwIDAtOC4xNzJ6IiBzdHJva2U9IiM1RjAwODAiIHN0cm9rZS13aWR0aD0iMS42IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K';
            heartIcon.classList.remove('filled'); // 클래스 제거
        } else {
            // 기본 하트를 빨간 하트로 변경
            heartIcon.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0yNS44MDcgNy44NjNhNS43NzcgNS43NzcgMCAwIDAtOC4xNzIgMEwxNiA5LjQ5N2wtMS42MzUtMS42MzRhNS43NzkgNS43NzkgMCAxIDAtOC4xNzMgOC4xNzJsMS42MzQgMS42MzQgNy40NjYgNy40NjdhMSAxIDAgMCAwIDEuNDE1IDBzMCAwIDAgMGw3LjQ2Ni03LjQ2N2gwbDEuNjM0LTEuNjM0YTUuNzc3IDUuNzc3IDAgMCAwIDAtOC4xNzJ6IiBmaWxsPSIjRkY1QTVBIiBzdHJva2U9IiNGRjVBNUEiIHN0cm9rZS13aWR0aD0iMS42IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K';
            heartIcon.classList.add('filled'); // 클래스 추가
        }
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

    const decreaseBtn = document.getElementById('decreaseBtn');
    const increaseBtn = document.getElementById('increaseBtn');
    const quantityDiv = document.getElementById('quantity');
    const priceSpan = document.getElementById('dcPrice');
    const totalPriceSpan = document.getElementById('totalPrice');

// 초기값 설정
    const dcPrice = parseInt(priceSpan.dataset.dcprice.replace(/,/g, ''), 10); // 쉼표 제거 후 숫자로 변환
    let quantity = 1;

// 초기 총 상품 금액 설정
    totalPriceSpan.textContent = (dcPrice * quantity).toLocaleString();

// 버튼 클릭 이벤트
    increaseBtn.addEventListener('click', () => {
        quantity += 1; // 수량 증가
        quantityDiv.textContent = quantity; // 수량 표시 업데이트
        totalPriceSpan.textContent = (dcPrice * quantity).toLocaleString(); // 총 상품 금액 업데이트
        decreaseBtn.disabled = false; // - 버튼 활성화
    });

    decreaseBtn.addEventListener('click', () => {
        if (quantity > 1) {
            quantity -= 1; // 수량 감소
            quantityDiv.textContent = quantity; // 수량 표시 업데이트
            totalPriceSpan.textContent = (dcPrice * quantity).toLocaleString(); // 총 상품 금액 업데이트

            // 수량이 1일 때 - 버튼 비활성화
            if (quantity === 1) {
                decreaseBtn.disabled = true;
            }
        }
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

