document.addEventListener("DOMContentLoaded", function () {
    const $reviewForm = document.getElementById('reviewForm');
    const $result = document.getElementById('result');
    const $title = document.querySelector('[name="title"]');
    const $content = document.querySelector('[name="content"]');
    const $imageInput = document.getElementById('imageInput');
    const $imageButton = document.getElementById('imageButton');


    // URL에서 productId 추출 (예: ?productId=123 형태로 전달된 경우)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    $imageButton.addEventListener("click", () => {
        $imageInput.click();
    });

    $reviewForm.onsubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('writer', '작성자');
        formData.append('title', $title.value);
        formData.append('content', $content.value);
        if ($imageInput.files.length > 0) {
            formData.append('image', $imageInput.files[0]);
        }
        formData.append('productId', productId); // productId 추가

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const response = JSON.parse(xhr.responseText);
                    if (response.result === 'success') {
                        $result.innerText = '후기를 성공적으로 작성하였습니다.';
                        $result.style.color = 'green';
                        // 작성 성공 시 상품 상세 페이지로 리다이렉트
                        window.location.href = `/kurly/index?productId=${productId}`;
                    } else {
                        $result.innerText = '후기 작성에 실패하였습니다.';
                        $result.style.color = 'red';
                    }
                } else {
                    alert('후기를 작성하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                }
            }
        };
        xhr.open('POST', '/kurly/review'); // 요청 URL에 productId 포함
        xhr.send(formData);

        $title.value = '';
        $content.value = '';
        $imageInput.value = '';
    };
});