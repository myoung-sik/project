package com.kms.test.services;

import com.kms.test.entities.ImageEntity;
import com.kms.test.entities.InquiryEntity;
import com.kms.test.entities.ReviewEntity;
import com.kms.test.mappers.ImageMapper;
import com.kms.test.mappers.InquiryMapper;
import com.kms.test.results.WriteResult;
import com.kms.test.vos.PageVo;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InquiryService {
    private final InquiryMapper inquiryMapper;

    @Autowired
    public InquiryService(InquiryMapper inquiryMapper) {
        this.inquiryMapper = inquiryMapper;
    }

    public WriteResult write(InquiryEntity inquiry) {
        if (inquiry == null || inquiry.getTitle() == null || inquiry.getTitle().isEmpty() || inquiry.getTitle().length() > 30 ||
                inquiry.getContent() == null || inquiry.getContent().isEmpty() || inquiry.getContent().length() < 2 || inquiry.getContent().length() > 30) {
            return WriteResult.FAILURE;
        }
        inquiry.setCreatedAt(LocalDateTime.now());
        return this.inquiryMapper.insertInquiry(inquiry) > 0 ? WriteResult.SUCCESS : WriteResult.FAILURE;
    }

    public List<InquiryEntity> getAllInquiries() {
        return this.inquiryMapper.selectAllInquiries();
    }

    public Pair<PageVo, List<InquiryEntity>> getInquiriesByPage(int page) {
        int totalCount = this.inquiryMapper.countInquiries();
        PageVo pageVo = new PageVo(page, totalCount);

        List<InquiryEntity> inquiries = this.inquiryMapper.selectInquiriesByPage(
                pageVo.countPerPage,
                pageVo.offsetCount);
        return Pair.of(pageVo, inquiries);
    }

    public Pair<PageVo, List<InquiryEntity>> getInquiriesByProductId(String productId, int inquiryPage) {
        // 전체 문의 수 조회
        int totalInquiries = inquiryMapper.countInquiriesByProductId(productId);

        // 페이지 정보 생성
        PageVo pageVo = new PageVo(inquiryPage, totalInquiries);

        // 페이징된 문의 목록 조회
        List<InquiryEntity> inquiries = inquiryMapper.selectInquiriesByProductId(productId, pageVo.countPerPage, pageVo.offsetCount);

        return Pair.of(pageVo, inquiries);
    }
}

