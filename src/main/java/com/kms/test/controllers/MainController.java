package com.kms.test.controllers;

import com.kms.test.entities.ImageEntity;
import com.kms.test.entities.InquiryEntity;
import com.kms.test.entities.ItemEntity;
import com.kms.test.entities.ReviewEntity;
import com.kms.test.results.CommonResult;
import com.kms.test.results.Result;
import com.kms.test.results.WriteResult;
import com.kms.test.services.InquiryService;
import com.kms.test.services.ItemService;
import com.kms.test.services.ReviewService;
import com.kms.test.vos.PageVo;
import org.apache.commons.lang3.tuple.Pair;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping(value = "/kurly")
public class MainController {
    private final InquiryService inquiryService;
    private final ReviewService reviewService;
    private final ItemService itemService;

    @Autowired
    public MainController(InquiryService inquiryService, ReviewService reviewService, ItemService itemService) {
        this.inquiryService = inquiryService;
        this.reviewService = reviewService;
        this.itemService = itemService;
    }

    @RequestMapping(value = "/image", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<byte[]> getImage(@RequestParam(value = "index", required = false, defaultValue = "0") int index) {
        ImageEntity image = this.reviewService.getImage(index);
        if (image == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity
                .ok()
                .contentLength(image.getData().length)
                .contentType(MediaType.parseMediaType(image.getContentType()))
                .body(image.getData());
    }

    @RequestMapping(value = "/image", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postImage(@RequestParam(value = "upload") MultipartFile file) throws IOException {
        ImageEntity image = new ImageEntity();
        image.setData(file.getBytes());
        image.setContentType(file.getContentType());
        image.setName(file.getOriginalFilename());
        JSONObject response = new JSONObject();
        boolean result = this.reviewService.uploadImage(image);
        if (result) {
            response.put("url", "/kurly/image?index=" + image.getIndex());
        }
        return response.toString();
    }

    @RequestMapping(value = "/index", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getInquiriesAndReviews(
            @RequestParam(value = "inquiryPage", required = false, defaultValue = "1") int inquiryPage,
            @RequestParam(value = "reviewPage", required = false, defaultValue = "1") int reviewPage,
            @RequestParam(value = "productId", required = false) String productId) {

        // 문의 사항과 리뷰 목록 가져오기
        Pair<PageVo, List<InquiryEntity>> pairInquiries = this.inquiryService.getInquiriesByPage(inquiryPage);
        Pair<PageVo, List<ReviewEntity>> pairReviews = this.reviewService.getReviewsByPage(reviewPage);


        if (productId != null) {
            // 특정 상품에 대한 문의와 리뷰 가져오기
            pairInquiries = this.inquiryService.getInquiriesByProductId(productId, inquiryPage);
            pairReviews = this.reviewService.getReviewsByProductId(productId, reviewPage);
        } else {
            // 모든 상품에 대한 문의와 리뷰 가져오기
            pairInquiries = this.inquiryService.getInquiriesByPage(inquiryPage);
            pairReviews = this.reviewService.getReviewsByPage(reviewPage);
        }

        // 총 리뷰 개수 가져오기
        int totalReviews = this.reviewService.getTotalReviewCount();

        // 리뷰 이미지 처리
        for (ReviewEntity review : pairReviews.getRight()) {
            if (review.getImageIndex() != null) {
                ImageEntity image = this.reviewService.getImage(review.getImageIndex());
                review.setImages(List.of(image));
            }
        }

        // productId가 전달된 경우 해당 상품 정보 가져오기
        ItemEntity product = null;
        if (productId != null) {
            product = this.itemService.getProductByProductId(productId);
        }

        ModelAndView modelAndView = new ModelAndView("goods/index");
        modelAndView.addObject("inquiryPageVo", pairInquiries.getLeft());
        modelAndView.addObject("reviewPageVo", pairReviews.getLeft());
        modelAndView.addObject("inquiries", pairInquiries.getRight());
        modelAndView.addObject("reviews", pairReviews.getRight());
        modelAndView.addObject("totalReviews", totalReviews);

        // 상품 정보를 모델에 추가 (productId가 있을 때만)
        if (product != null) {
            modelAndView.addObject("product", product);
        }

        return modelAndView;
    }

    @RequestMapping(value = "/inquiry", method = RequestMethod.GET)
    public ModelAndView getWrite() {
        return new ModelAndView("write/inquiry");
    }

    @RequestMapping(value = "/inquiry", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postWrite(InquiryEntity inquiry) {
        JSONObject response = new JSONObject();
        WriteResult result = this.inquiryService.write(inquiry);
        response.put("result", result.name().toLowerCase());
        return response.toString();
    }

    @RequestMapping(value = "/review", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getReview(@RequestParam(value = "productId") String productId,
                                  @RequestParam(value = "page", required = false, defaultValue = "1") int page) {

        System.out.println("productId: " + productId);
        Pair<PageVo, List<ReviewEntity>> pair = this.reviewService.getReviewsByPage(page);
        List<ReviewEntity> reviews = pair.getRight();

        for (ReviewEntity review : reviews) {
            if (review.getImageIndex() != null) {
                ImageEntity image = this.reviewService.getImage(review.getImageIndex());
                review.setImages(List.of(image));
            }
        }

        ModelAndView modelAndView = new ModelAndView("write/review");
        modelAndView.addObject("pageVo", pair.getLeft());
        modelAndView.addObject("reviews", reviews);
        modelAndView.addObject("productId", productId); // productId를 추가
        return modelAndView;
    }

    @RequestMapping(value = "/review", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postReview(@RequestParam(value = "title") String title,
                             @RequestParam(value = "content") String content,
                             @RequestParam(value = "productId") String productId,
                             @RequestParam(value = "image", required = false) MultipartFile imageFile) throws IOException {
        System.out.println("productId: " + productId);

        ReviewEntity review = new ReviewEntity();
        review.setWriter("작성자");
        review.setTitle(title);
        review.setContent(content);
        review.setProductId(productId); // 받은 productId를 사용

        JSONObject response = new JSONObject();
        Result result = this.reviewService.write(review, imageFile);
        response.put("result", result.name().toLowerCase());
        return response.toString();
    }

    // 리뷰 수정 처리
    @RequestMapping(value = "/modify", method = RequestMethod.PATCH)
    @ResponseBody
    public String modifyReview(@RequestParam("index") int index,
                               @RequestParam("title") String title,
                               @RequestParam("content") String content,
                               @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
        ReviewEntity review = new ReviewEntity();
        review.setIndex(index);
        review.setTitle(title);
        review.setContent(content);

        CommonResult result = reviewService.modifyReview(review, image);
        JSONObject response = new JSONObject();
        response.put("result", result.name().toLowerCase());
        return response.toString();
    }

    @RequestMapping(value = "/modify", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getModify(@RequestParam(value = "index", required = false, defaultValue = "0") int index,
                                  @RequestParam(value = "productId", required = false) String productId) {
        ModelAndView modelAndView = new ModelAndView();

        // index에 해당하는 리뷰를 가져옵니다.
        ReviewEntity review = this.reviewService.getReviewByIndex(index);

        // 리뷰가 존재하고, 삭제되지 않은 경우에만 수정 가능
        if (review != null && review.getDeletedAt() == null) {
            modelAndView.addObject("review", review); // 리뷰 객체를 HTML로 전달
            modelAndView.setViewName("goods/modify"); // "goods/modify.html"로 이동
        } else {
            // 수정 후 원래의 상품 페이지로 리다이렉트
            if (productId != null) {
                modelAndView.setViewName("redirect:/kurly/index?productId=" + productId);
            } else {
                modelAndView.setViewName("redirect:/kurly/index");
            }
        }
        // 기본 뷰 페이지 설정
        return modelAndView;
    }

    @RequestMapping(value = "/delete", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String deleteReview(@RequestParam(value = "index", required = true) int index) {
        JSONObject response = new JSONObject();
        CommonResult result = reviewService.deleteReview(index); // 서비스 호출

        if (result == CommonResult.SUCCESS) {
            response.put("result", "success");
        } else {
            response.put("result", "failure");
        }
        return response.toString();
    }

    @RequestMapping(value = "/crawl", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String crawlAndSave(@RequestParam(value = "productId") String productId) throws IOException {
        JSONObject response = new JSONObject();
        if (productId == null || productId.isEmpty()) {
            response.put("result", "failure");
            response.put("message", "Invalid productId");
            return response.toString();
        }

        ItemEntity item = this.itemService.crawlAndSaveKurly(productId);
        if (item != null) {
            response.put("result", "success");
            response.put("data", item);
        } else {
            response.put("result", "failure");
            response.put("message", "Failed to crawl data or save item.");
        }
        return response.toString();
    }

    @RequestMapping(value = "/crawl", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String crawlAndSaveKurlyWithGet(@RequestParam("productId") String productId) {
        JSONObject response = new JSONObject();

        // 크롤링 로직 호출
        try {
            ItemEntity item = this.itemService.crawlAndSaveKurly(productId); // 실제 크롤링 실행
            if (item != null) {
                response.put("result", "success");
                response.put("data", item); // 크롤링된 데이터 반환
            } else {
                response.put("result", "failure");
                response.put("message", "Failed to crawl data.");
            }
        } catch (IOException e) {
            response.put("result", "failure");
            response.put("message", "Error during crawling: " + e.getMessage());
        }

        return response.toString(); // JSON 응답 반환
    }

    @RequestMapping(value = "/manual", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String saveManualItem(@RequestBody ItemEntity itemEntity) {
        JSONObject response = new JSONObject();

        if (itemEntity == null) {
            response.put("result", "failure");
            response.put("message", "Invalid item data");
            return response.toString();
        }
        itemEntity.setIsManual(true);
        CommonResult result = itemService.saveManualItem(itemEntity);
        response.put("result", result.name().toLowerCase());
        return response.toString();
    }

    @RequestMapping(value = "/items", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getAllItems() {
        JSONObject response = new JSONObject();
        response.put("items", this.itemService.getAllItems());
        return response.toString();
    }

    @RequestMapping(value = "/item", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getItemByIndex(@RequestParam(value = "index") int index) {
        JSONObject response = new JSONObject();
        ItemEntity item = this.itemService.getItemByIndex(index);
        if (item != null) {
            response.put("result", "success");
            response.put("data", item);
        } else {
            response.put("result", "failure");
            response.put("message", "Item not found.");
        }
        return response.toString();
    }
}
