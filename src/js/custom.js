/* =================================================================
초기설정
================================================================= */

//device sizes
$mq_tablet = 1101;
$mq_tablet_sm = 769;

// 터치 기기 인 경우 html에 'touch-device' 클래스 추가
if ('ontouchstart' in document.documentElement) {
    document.documentElement.className += 'touch-device';
}

// ios 대응 vh css 변수 설정
const $vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${$vh}px`);

// SVG drawing motion path 길이 css 설정
const $path_k = document.querySelector('.logo__k'),
    $path_elly = document.querySelector('.logo__elly'),
    $path_eye_l = document.querySelector('.logo__eye-l'),
    $path_eye_r = document.querySelector('.logo__eye-r'),
    $path_k_leng = Math.ceil($path_k.getTotalLength()),
    $path_elly_leng = Math.ceil($path_elly.getTotalLength()),
    $path_eye_l_leng = Math.ceil($path_eye_l.getTotalLength()),
    $path_eye_r_leng = Math.ceil($path_eye_r.getTotalLength());

$path_k.style.cssText = `
    stroke-dasharray: ${$path_k_leng};
    stroke-dashoffset:${$path_k_leng};
`;

$path_elly.style.cssText = `
    stroke-dasharray: ${$path_elly_leng};
    stroke-dashoffset: ${$path_elly_leng};
`;

$path_eye_l.style.cssText = `
    stroke-dasharray: ${$path_eye_l_leng};
    stroke-dashoffset:${$path_eye_l_leng};
`;

$path_eye_r.style.cssText = `
    stroke-dasharray: ${$path_eye_r_leng};
    stroke-dashoffset: ${$path_eye_r_leng};
`;

/* =================================================================
intro 화면 animtaion
================================================================= */

// scroll magic controller 선언
let $controller = new ScrollMagic.Controller();

const $html = document.querySelector('html'),
    $wrap = document.querySelector('.wrap'),
    $header = document.querySelector('.header'),
    $logo = document.getElementById('logo'),
    $toggleBox = document.querySelector('.toggle__box');

/**
 *  TweenMax 정의
 *
 *  TweenMax.to(element, duration, css properties)
 *  TweenMax.fromTo(element, duration, css properties(from), css properties(to))
 */

// 인트로 (SVG drawing + header size 모션)

$tween_logoDraw = new TimelineMax()
    .delay(1)
    .add(TweenMax.to($path_k, 0.65, { strokeDashoffset: 0, ease: 'sine.in' }))
    .add(TweenMax.to($path_elly, 2.2, { strokeDashoffset: 0, ease: 'sine.in' }))
    .add(TweenMax.to($path_eye_l, 0.6, { delay: 0.4, strokeDashoffset: 0, ease: window.innerWidth < $mq_tablet_sm ? 'sine.in' : 'elastic.out(1, 0.3)' }))
    .add(TweenMax.to($path_eye_r, 0.7, { delay: 0.1, strokeDashoffset: 0, ease: window.innerWidth < $mq_tablet_sm ? 'sine.in' : 'elastic.out(1, 0.3)' }), 'queue')
    .add(TweenMax.to('.intro-box', 2, { height: 60, ease: 'power1.in' }), 'queue+=0.5')
    .add(TweenMax.to('#logo', 1.2, { width: 52, height: 'auto', left: window.innerWidth < $mq_tablet_sm ? 20 : 40, marginLeft: 26, ease: 'power1.in' }), 'queue+=1.3')
    .add(TweenMax.fromTo('#toggle_btn', 0.5, { opacity: 0, x: 100 }, { opacity: 1, x: 0 }), 'queue+=2')
    .call(() => {
        $wrap.classList.remove('loading');
        $header.classList.add('end');
    });

/* =================================================================
로고 새로고침
================================================================= */

// 로고 클릭 시 새로고침
$logo.addEventListener('click', reload);

// 로고 focus일 때 엔터키로 새로고침
$logo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        reload();
    }
});

function reload(e) {
    if ($wrap.classList.contains('loading')) {
        e.preventDefault();
    } else {
        window.location.reload();
    }
}

/* =================================================================
메뉴 active bar
================================================================= */

const $gnb = document.querySelector('.gnb'),
    $gnbItem = document.querySelectorAll('.gnb__item'),
    $activeBg = document.querySelector('.active-bar'),
    $scrollTarget = document.querySelectorAll('.section[data-name]'),
    $scrollTopPos = [],
    $hamburger = document.querySelector('.hamburger');

let $activeList = document.querySelector('.gnb__list.is-active');

// active-bar 초기설정
$activeBg.style.width = $activeList.offsetWidth + 'px';
$activeBg.style.left = 0;

// active-bar 위치
$gnbItem.forEach((item, idx) => {
    $scrollTopPos.push($scrollTarget[idx].offsetTop); // 각 섹션 scrollTop값 배열로 출력

    item.addEventListener('click', function () {
        if (window.innerWidth < $mq_tablet) {
            mobileMenuOpen();
        } else {
            // 클릭한 메뉴로 active-bar 이동
            $leftPos = this.offsetLeft;
            $activeBg.style.width = this.offsetWidth + 'px';
            $activeBg.style.left = $leftPos + 'px';

            this.parentNode.classList.add('is-active');

            $gnbItem.forEach((el) => {
                el.parentNode.classList.toggle('is-active', this === el);
            });
        }

        $menuData = this.getAttribute('data-name');
        $sectionTopPos = document.querySelector(`.section[data-name="${$menuData}"]`).offsetTop;

        // 클릭한 메뉴 섹션으로 스크롤 이동
        window.scroll(top, $sectionTopPos);

        // 모바일 메뉴가 열린채로 PC 사이즈로 변경되었을 때 메뉴 클릭시
        if ($hamburger.classList.contains('is-open')) {
            $hamburger.classList.remove('is-open');
            $header.classList.remove('menu-open');
            bodyOverflow('auto');
        }
    });
});

// 스크롤 시 active-bar 이동
window.addEventListener('scroll', () => {
    const $menuList = document.querySelectorAll('.gnb__list');
    let $activeList = document.querySelector('.gnb__list.is-active');

    $menuList.forEach((el) => {
        if (el.classList.contains('is-active')) {
            $leftPos = $activeList.offsetLeft;

            $activeBg.style.width = $activeList.offsetWidth + 'px';
            $activeBg.style.left = $leftPos + 'px';
        }
    });
});

// 모바일 햄버거 버튼 클릭시 모바일 메뉴 오픈
$hamburger.addEventListener('click', () => mobileMenuOpen());

function mobileMenuOpen() {
    $hamburger.classList.toggle('is-open');
    $header.classList.toggle('menu-open');
    $header.classList.contains('menu-open') ? bodyOverflow('hidden') : bodyOverflow('auto'); // 모바일 메뉴 열릴 때 스크롤 고정
}

function bodyOverflow(overflow) {
    document.querySelector('body').style.overflow = overflow;
}

/* =================================================================
라이트모드-다크모드 테마 토글 버튼
================================================================= */

const $themeCheckBox = document.querySelector('.toggle__item'),
    $themelabel = document.querySelector('.toggle__btn'),
    $themeIcons = document.querySelectorAll('.toggle__icon .item');

// 클릭시 테마 변경
$themeCheckBox.addEventListener('click', () => {
    $html.classList.toggle('light-theme');

    for (let i = 0; i < $themeIcons.length; i++) {
        $themeIcons[i].classList.toggle('on');
    }
});

// 탭키 이동 후 엔터로 테마 변겅
$themelabel.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        $html.classList.toggle('light-theme');

        if ($html.classList.contains('light-theme')) {
            $themeCheckBox.checked = false;
        } else {
            $themeCheckBox.checked = true;
        }

        for (let i = 0; i < $themeIcons.length; i++) {
            $themeIcons[i].classList.toggle('on');
        }
    }
});

/* =================================================================
project 섹션 toggle(더보기) 버튼
================================================================= */

const $projectGrid = document.querySelector('.project__grid'),
    $projectItem = document.querySelectorAll('.project__item'),
    $displayBtn = document.getElementById('btn-display'),
    $screenTxt = $displayBtn.querySelector('.text-hide'),
    $toggleLines = $displayBtn.querySelectorAll('.line');

let $showProjectItem = 6;

// $showProjectItem(6)개 아이템 show
projectCardDisplay();

// project toggle버튼 클릭 시 아이템 토글
$displayBtn.addEventListener('click', toggleProjects);

// project focus 시 엔터키로 토글
$displayBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        toggleProjects();
    }
});

if (window.innerWidth < $mq_tablet_sm) {
    $showProjectItem = 3;

    projectCardDisplay();
    $displayBtn.addEventListener('click', toggleProjects);
}

window.addEventListener('resize', () => {
    if (window.innerWidth < $mq_tablet_sm) {
        $showProjectItem = 3;

        projectCardDisplay();
        $displayBtn.addEventListener('click', toggleProjects);
    } else {
        $showProjectItem = 6;

        projectCardDisplay();
        $displayBtn.addEventListener('click', toggleProjects);
    }
});

function projectCardDisplay() {
    for (let i = 0; i < $projectItem.length; i++) {
        $projectItem[i].style.display = 'none';
        if (i < $showProjectItem) {
            $projectItem[i].style.display = 'flex';
        }
    }
}

// 프로젝트 영역 토글 - 확장
function projectOpen() {
    for (let i = 0; i < $projectItem.length; i++) {
        $projectItem[i].style.display = 'flex';
    }
    $screenTxt.textContent = '접기';
    $toggleLines[0].classList.remove('rotate');
    $displayBtn.classList.add('opened');
}

// 프로젝트 영역 토글 - 축소
function projectClose() {
    for (let i = 0; i < $projectItem.length; i++) {
        if (i >= $showProjectItem) {
            $projectItem[i].style.display = 'none';
        }
    }
    $screenTxt.textContent = '더보기';
    $toggleLines[0].classList.add('rotate');
    $displayBtn.classList.remove('opened');

    // 그리드 접었을 때 project 섹션으로 스크롤 이동
    $projectTopPos = document.querySelector(`.section[data-name="project"]`).offsetTop;
    window.scroll(top, $projectTopPos);
}

function toggleProjects() {
    if ($projectGrid.classList.contains('default')) {
        projectOpen();
    } else {
        projectClose();
    }
    $projectGrid.classList.toggle('default');
}

/* =================================================================
contact 이모티콘 move
================================================================= */

let $contactWrap = document.querySelector('.contact__wrap'),
    $icons = document.querySelectorAll('.contact__icon'),
    $width = $contactWrap.offsetWidth - $icons[0].offsetWidth,
    $height = $contactWrap.offsetHeight - $icons[0].offsetHeight;

for (let i = 0; i < $icons.length; i++) {
    let posX = Math.random() * $width;
    let posY = Math.random() * $height;
    let posVX = Math.random() * 2 - Math.random() * 2;
    let posVY = Math.random() * 2 - Math.random() * 2;
    let speed = Math.round(Math.random() * 80);

    $icons[i].style.left = `${posX}px`;
    $icons[i].style.top = `${posY}px`;

    setInterval(() => {
        posX += posVX;
        posY += posVY;

        if (posX <= 0 || posX >= $width) {
            posVX = -posVX;
        }
        if (posY <= 0 || posY >= $height) {
            posVY = -posVY;
        }

        $icons[i].style.left = `${posX}px`;
        $icons[i].style.top = `${posY}px`;
    }, speed);
}

window.addEventListener('resize', () => {
    $contactWrap = document.querySelector('.contact__wrap');
    $icons = document.querySelectorAll('.contact__icon');

    $width = $contactWrap.offsetWidth - $icons[0].offsetWidth;
    $height = $contactWrap.offsetHeight - $icons[0].offsetHeight;
});

/* =================================================================
스크롤 애니메이션
================================================================= */

// 이미지 시퀀스 배열 생성
const $avataImgSqc = new Array();
const $imgTag = document.querySelector('.avata__sequence');

for (let i = 1; i < 48; i++) {
    $avataImgSqc.push(`https://storage.googleapis.com/kellyfolio0524.appspot.com/avata-${i}.png`);
}

// 시퀀스 이미지 프리로드
function preloading(preImgs) {
    let imgTotal = preImgs.length;
    for (let i = 0; i < imgTotal; i++) {
        let img = new Image();
        img.src = preImgs[i];
    }
}

preloading($avataImgSqc);

// About section 아바타 이미지 시퀀스
const $img = { crntImg: 0 };

let $tween_avata = TweenMax.to($img, 1, {
    crntImg: $avataImgSqc.length - 1,
    roundProps: 'crntImg',
    immediateRender: true,
    onUpdate: function () {
        $imgTag.setAttribute('src', $avataImgSqc[$img.crntImg]);
    },
});

new ScrollMagic.Scene({
    duration: 4700,
    triggerElement: '.about',
    triggerHook: 0,
    offset: -60,
})
    .setTween($tween_avata)
    .setPin('.about')
    .addTo($controller);

// about 텍스트 박스 slide up
const $tween_about = TweenMax.fromTo('.about__text', 0.5, { opacity: 0, y: 60 }, { opacity: 1, y: 0 });
new ScrollMagic.Scene({
    triggerElement: '.about__text',
    triggerHook: 0.9,
})
    .setTween($tween_about)
    .addTo($controller);

//how to work 타이틀 slide left to right (mobile only)
if (window.innerWidth < $mq_tablet_sm) {
    const $tween_howtoTitle = TweenMax.fromTo('.howtowork .section__title', 10, { x: -300 }, { x: 0 });

    new ScrollMagic.Scene({
        duration: '50%',
        triggerElement: '.about__text',
        triggerHook: 0,
        offset: '300%',
    })
        .setTween($tween_howtoTitle)
        .addTo($controller);
}

//how to work 섹션 pinned 모션
let pinned = new ScrollMagic.Scene({
    duration: 1000,
    triggerElement: '.howtowork',
    triggerHook: 0,
    offset: -150,
})
    .setPin('.howtowork .section__title')
    .setClassToggle('.section__title', 'is-active')
    .addTo($controller);

if (window.innerWidth < $mq_tablet_sm) {
    pinned.destroy(true);
}

window.addEventListener('resize', () => {
    if (window.innerWidth < $mq_tablet_sm) {
        pinned.destroy(true);
    } else {
        pinned.destroy(true);
        pinned = new ScrollMagic.Scene({
            duration: 1000,
            triggerElement: '.howtowork',
            triggerHook: 0,
            offset: -150,
        })
            .setPin('.howtowork .section__title')
            .setClassToggle('.section__title', 'is-active')
            .addTo($controller);
    }
});

// project 섹션 타이틀 slide up
$tween_project = new TimelineMax()
    .add(TweenMax.fromTo('.project__wrap .section__title', 0.5, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }), 'queue')
    .add(TweenMax.fromTo('.project__wrap .btn', 0.5, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }), 'queue+=0.1');

new ScrollMagic.Scene({
    triggerElement: '.project',
    triggerHook: 0.6,
})
    .setTween($tween_project)
    .addTo($controller);

// project 섹션 그리드영역 slide up
const $tween_grid = TweenMax.fromTo('.project__grid', 0.7, { opacity: 0, y: 50 }, { opacity: 1, y: 0 });

new ScrollMagic.Scene({
    triggerElement: '.project__wrap',
    triggerHook: 0.5,
})
    .setTween($tween_grid)
    .addTo($controller);

// codepen 섹션 타이틀 slide left to right
const $tween_codepen = TweenMax.fromTo('.codepen .section__title', 10, { x: -500 }, { x: 1500 });

new ScrollMagic.Scene({
    duration: '3000',
    triggerElement: '.codepen',
    triggerHook: 0.8,
})
    .setTween($tween_codepen)
    .addTo($controller);

// contact 타이틀 opacity
const $tween_contact = TweenMax.fromTo('.contact .section__title', 0.5, { opacity: 0 }, { opacity: 1 });
new ScrollMagic.Scene({
    duration: 500,
    triggerElement: '.contact',
    triggerHook: 0.5,
    offset: -300,
})
    .setTween($tween_contact)
    .addTo($controller);

// 이메일 텍스트 slide left
const $tween_email = TweenMax.fromTo('.contact__email', 3, { opacity: 0, x: -100 }, { opacity: 1, x: 0, ease: Elastic.easeOut.config(1, 0.3) });
new ScrollMagic.Scene({
    triggerElement: '.contact .section__title',
    triggerHook: 0.5,
    offset: -50,
})
    .setTween($tween_email)
    .addTo($controller);

// 스크롤 시  Navigation text active

const $menuController = new ScrollMagic.Controller({ globalSceneOptions: { triggerHook: 0.25 } });

// home 섹션
const $home = document.querySelector('.about .section__container'),
    $homeHeight = $home.offsetHeight;

new ScrollMagic.Scene({
    triggerElement: $home,
    duration: $homeHeight,
})
    .setClassToggle('#home', 'is-active')
    .on('enter', () => document.querySelector('#home .gnb__item').classList.add('is-active'))
    .addTo($menuController);

// how to work 섹션
const $howtowork = document.querySelector('.howtowork .section__container'),
    $howtoworkHeight = $howtowork.offsetHeight;

new ScrollMagic.Scene({
    triggerElement: $howtowork,
    duration: $howtoworkHeight,
})
    .on('enter', () => document.querySelector('#home .gnb__item').classList.remove('is-active'))
    .setClassToggle('#howtowork', 'is-active')
    .addTo($menuController);

// project 섹션
const $project = document.querySelector('.project'),
    $projectHeight = $project.offsetHeight;

new ScrollMagic.Scene({
    triggerElement: $project,
    duration: $projectHeight,
})
    .on('enter', () => document.querySelector('#howtowork .gnb__item').classList.remove('is-active'))
    .setClassToggle('#project', 'is-active')
    .addTo($menuController);

// contact 섹션
new ScrollMagic.Scene({
    triggerElement: '.carousel__arrow',
})
    .on('enter', () => {
        document.querySelector('#project').classList.remove('is-active');
    })
    .on('leave', () => {
        document.querySelector('#project').classList.add('is-active');
    })
    .setClassToggle('#contact', 'is-active')
    .addTo($menuController);

/* =================================================================
Carousel
================================================================= */

const $carousel = document.querySelector('.carousel'),
    $carouselWrap = document.querySelector('.carousel__wrap'),
    $time = 6000; // 슬라이드가 이동하는 간격

let $slide = document.querySelectorAll('.slide');

const $slideLength = $slide.length,
    $lastSlideIdx = $slideLength - 1;

let $showSlide = 3,
    $left = 100 / $showSlide;

// UI setting
$carouselWrap.style.width = `${(100 * $slideLength) / $showSlide}%`;

let $clonedSlide = $slide[$lastSlideIdx].cloneNode(true);

$slide[$lastSlideIdx].remove();
$carouselWrap.insertBefore($clonedSlide, $slide[0]);
$slide[0].classList.add('is-active');

// codepen 섹션에 스크롤이 들어왔을 때 autoCarousel 실행, 벗어나면 멈춤
new ScrollMagic.Scene({
    triggerElement: '.codepen__wrap',
    duration: '100%',
    triggerHook: 0.8,
})
    .on('enter', () => autoCarousel())
    .on('leave', () => stopCarousel())
    .addTo($controller);

// 모바일에서 센터모드 해제 (슬라이드 1개씩 이동)
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        carouselMobile();
        $carousel.classList.add('is-mobile');
    } else {
        $showSlide = 3;
        $left = 100 / $showSlide;
        $carouselWrap.style.cssText = `
            width: ${(100 * $slideLength) / $showSlide}%;
            left: 0%;
        `;
        $carousel.classList.remove('is-mobile');
    }
});

if (window.innerWidth <= 768) {
    carouselMobile();

    $carousel.classList.toggle('is-mobile');
}

// 모바일화면에서 carousel 세팅
function carouselMobile() {
    $showSlide = 1;
    $left = 200;
    $carouselWrap.style.cssText = `
        width: ${(100 * $slideLength) / $showSlide}%;
        left: -100%;
    `;
}

// carousel 영역 위에 마우스 hover시 슬라이드 멈춤
$carousel.addEventListener('mouseenter', () => {
    stopCarousel();
});

$carousel.addEventListener('mouseleave', () => {
    if ($modal.classList.contains('is-open')) {
        stopCarousel();
    } else {
        autoCarousel();
    }
});

// 화살표 클릭
const $carouselArw = document.querySelectorAll('.carousel__arrow');

$carouselArw.forEach((arwBtn) => {
    arwBtn.addEventListener('click', carouselHandler);

    arwBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            carouselHandler();
        }
    });
});

// 오토 슬라이드
function autoCarousel() {
    $auto = setInterval(function () {
        $carousel.classList.remove('prev');
        slideMove(0, $lastSlideIdx);
    }, $time);
}

// 슬라이드 멈춤
function stopCarousel() {
    clearInterval($auto);
}

// 슬라이드 이동
function slideMove(removeIdx, insertIdx) {
    let $slide = $carouselWrap.querySelectorAll('.slide');

    let $clonedSlide = $slide[removeIdx].cloneNode(true);
    $slide[removeIdx].remove();

    $slideWidth = $slide[1].offsetWidth;

    // [이전] 버튼 클릭시
    if ($carousel.classList.contains('prev')) {
        $carouselWrap.insertBefore($clonedSlide, $slide[insertIdx]);

        $carousel.style.transform = `translateX(-${$slideWidth}px)`;
        $carouselWrap.style.transform = `translateX(${$slideWidth}px)`;
    } else {
        $carouselWrap.insertBefore($clonedSlide, $slide[insertIdx + 1]);

        $carousel.style.transform = `translateX(${$slideWidth}px)`;
        $carouselWrap.style.transform = `translateX(-${$slideWidth}px)`;
    }

    $carouselWrap.classList.add('moving');

    setTimeout(() => {
        $carouselWrap.classList.remove('moving');
        $carousel.style.transform = `translateX(0)`;
        $carouselWrap.style.transform = `translateX(0)`;
    }, 700);

    $slide = $carouselWrap.querySelectorAll('.slide');

    $slide.forEach((item) => {
        item.classList.remove('is-active');
        modal(item);
    });

    $slide[1].classList.add('is-active');
}

// 슬라이드 이동 시 transition 세팅
function transitionSet() {
    $slide = document.querySelectorAll('.slide');

    // 슬라이드 이동 transition
    if ($carouselWrap.classList.contains('moving')) {
        $carouselWrap.classList.remove('moving');
    } else {
        $carouselWrap.classList.add('moving');
    }
}

// [다음] 으로 슬라이드 이동
function moveNext() {
    $carousel.classList.remove('prev');
    stopCarousel();
    slideMove(0, $lastSlideIdx);
    autoCarousel();
}

// [이전] 으로 슬라이드 이동
function movePrev() {
    $carousel.classList.add('prev');
    stopCarousel();
    slideMove($lastSlideIdx, 0);
    autoCarousel();
}

function carouselHandler() {
    if (this.classList.contains('next')) {
        moveNext();
    } else {
        movePrev();
    }
}

/* =================================================================
Carousel 각 슬라이드 클릭 시 모달 오픈
================================================================= */

const $modal = document.querySelector('.modal'),
    $layer = document.querySelector('.modal__layer'),
    $codeItem = document.querySelectorAll('.modal__item');

$slide = $carouselWrap.querySelectorAll('.slide');

$slide.forEach((item) => {
    modal(item);
});

function modal(el) {
    // 슬라이드 클릭 시 모달 오픈
    el.addEventListener('click', () => {
        modalHandler(el);
    });

    // 슬라이드 focus일 때 모달 오픈
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            modalHandler();
        }
    });
}

function modalOpen(el) {
    getData = el.getAttribute('data-name');

    $modalItem = document.querySelector(`.modal__item[data-name="${getData}"]`);

    $modal.classList.add('is-open');
    $modal.style.display = 'block';
    $modal.focus();
    $modalItem.style.display = 'block';
    document.querySelector('body').classList.add('overflow');
}

function modalClose() {
    $modal.classList.remove('is-open');
    $modal.style.display = 'none';
    $modalItem.style.display = 'none';
    document.querySelector('body').classList.remove('overflow');

    stopCarousel();
    autoCarousel();
}

function modalHandler(el) {
    //모달창 오픈
    modalOpen(el);

    // 배경 레이어 클릭해서 모달창 닫기
    $layer.addEventListener('click', modalClose);

    // esc키로 모달창 닫기
    $modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modalClose();
        }
    });
}
