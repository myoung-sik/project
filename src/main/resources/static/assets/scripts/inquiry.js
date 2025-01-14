const $inquiryForm = document.getElementById('inquiryForm');
const $result = document.getElementById('result');
const $title = document.body.querySelector('[name="title"]');
const $content = document.body.querySelector('[name="content"]');

// URL에서 productId 추출 (예: ?rpdocutId=123 형태로 전달된 경우)
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productId');

$inquiryForm.onsubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('writer', '작성자'); // 여기서 '작성자'는 실제 로그인된 사용자의 정보로 변경 필요
    formData.append('title', $title.value);
    formData.append('content', $content.value);
    formData.append('status', '답변완료'); // 작성자랑 마찬가지, 실제 상태로 수정 필요
    formData.append('productId', productId);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            alert(`문의를 작성하지 못하였습니다. 잠시 후 다시 시도해 주세요.`);
            return;
        }

        const response = JSON.parse(xhr.responseText);
        switch(response['result']) {
            case 'failure':
                $result.innerText = '문의 작성에 실패하였습니다.';
                $result.style.color = 'red';
                break;
            case 'success':
                $result.innerText = '문의를 성공적으로 작성하였습니다.';
                $result.style.color = 'green';
                // 작성 성공 시 상품 상세 페이지로 리다이렉트
                window.location.href = `/kurly/index?page=1&productId=${productId}`;
                break;
        }
    };
    xhr.open('POST', `/inquiries?productId=${productId}`); // 요청 URL에 productId 포함
    xhr.send(formData);
    $result.innerText = '';
}
