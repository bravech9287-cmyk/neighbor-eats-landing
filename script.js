// ************************************************************
// 1. 폼 제출 처리 (Netlify Forms 연동)
// ************************************************************
const form = document.getElementById('betaForm');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // 기본 제출 동작(새로고침) 막기

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // 로딩 상태 표시
        submitBtn.disabled = true;
        submitBtn.textContent = '신청 처리 중... 🚀';
        submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

        try {
            const formData = new FormData(e.target);

            // Netlify Forms는 'form-name'이 데이터의 가장 처음에 있는 것을 선호합니다.
            const searchParams = new URLSearchParams();
            searchParams.append('form-name', 'beta-signup'); // 이름을 가장 먼저!

            formData.forEach((value, key) => {
                searchParams.append(key, value);
            });

            // Netlify 서버로 데이터 전송
            const response = await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: searchParams.toString(),
            });

            if (response.ok) {
                alert('🎉 베타 신청이 완료되었습니다!\n관심 가져주셔서 감사합니다, 곧 연락드리겠습니다.');
                e.target.reset(); // 폼 초기화
            } else {
                throw new Error('서버 응답 오류');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('❌ 신청 중 오류가 발생했습니다.\n잠시 후 다시 시도해주시거나, 문의 부탁드립니다.');
        } finally {
            // 버튼 상태 원상 복구
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    });
}

// ************************************************************
// 3. 전화번호 자동 포맷팅 (010-0000-0000)
// ************************************************************
const phoneInput = document.querySelector('input[name="phone"]');

if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // 숫자가 아닌 문자는 제거

        if (value.substring(0, 2) === '02') {
            // 서울 02 번호 처리 (예: 02-123-4567 또는 02-1234-5678)
            if (value.length > 2) {
                if (value.length <= 5) {
                    value = value.replace(/(\d{2})(\d{1,3})/, '$1-$2');
                } else if (value.length <= 9) {
                    value = value.replace(/(\d{2})(\d{3})(\d{1,4})/, '$1-$2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{4})(\d{1,4})/, '$1-$2-$3');
                }
            }
        } else {
            // 그 외 (휴대폰 010 등)
            if (value.length > 3) {
                if (value.length <= 7) {
                    value = value.replace(/(\d{3})(\d{1,4})/, '$1-$2');
                } else {
                    value = value.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3');
                }
            }
        }

        // 최대 길이 제한 (하이픈 포함 약 13자)
        e.target.value = value.substring(0, 13);
    });
}

// ************************************************************
// 4. 스크롤 애니메이션 (Intersection Observer)
// ************************************************************
const observerOptions = {
    threshold: 0.15,       // 요소가 15% 보일 때 트리거
    rootMargin: '0px 0px -50px 0px' // 하단에서 50px 위로 올라왔을 때
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target); // 한 번 애니메이션 후 감시 중단 (선택사항)
        }
    });
}, observerOptions);

// 애니메이션을 적용할 요소들 선택
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
});
