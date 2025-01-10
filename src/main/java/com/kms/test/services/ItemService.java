package com.kms.test.services;

import com.kms.test.entities.ItemEntity;
import com.kms.test.mappers.ItemMapper;
import com.kms.test.results.CommonResult;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;

@Service
public class ItemService {
    private final ItemMapper itemMapper;

    public ItemService(ItemMapper itemMapper) {
        this.itemMapper = itemMapper;
    }

    @Transactional
    public ItemEntity crawlAndSaveKurly(String productId) throws IOException {
        if (productId == null || productId.isEmpty()) {
            return null;
        }
        String url = String.format("https://www.kurly.com/goods/%s", productId);
        Document document = Jsoup.connect(url).get();

        ItemEntity item = new ItemEntity();
        item.setProductId(productId);
        Elements $itemImage = document.select("img[src^=\"https://img-cf.kurly.com/hdims/resize/%5E%3E720x%3E936/cropcenter/720x936/quality/85/src/shop/data/goods/\"], img[src^=\"https://product-image.kurly.com/hdims/resize/%5E%3E720x%3E936/cropcenter/720x936/quality/85/src/product/image/\"]");
        Elements $title = document.select("h1.css-3eizrx.ezpe9l11");
        Elements $detail = document.select("h2.css-1q0tnnd.ezpe9l10");
        Elements $dcRate = document.select("span.css-5nirzt.e1q8tigr3");
        Elements $dcPrice = document.select("span.css-9pf1ze.e1q8tigr2");
        Elements $price = document.select("span.css-1e1rd4p.e1q8tigr0");
        Elements $delivery = document.select("li.css-e6zlnr:has(dt:contains(배송)) p.css-c02hqi.e6qx2kx1");
        Elements $seller = document.select("li.css-e6zlnr:has(dt:contains(판매자)) p.css-c02hqi.e6qx2kx1");
        Elements $packaging = document.select("li.css-e6zlnr:has(dt:contains(포장타입)) p.css-c02hqi.e6qx2kx1");
        Elements $detailImage = document.select("div.goods_intro img[src^=\"https://img-cf.kurly.com/hdims/resize/%3E1010x/quality/90/src/shop/data/goodsview/\"]");
        Elements $words = document.select("p.words");
        Elements $kurlyCheck = document.select("div.context.last img[src^=\"https://img-cf.kurly.com/hdims/resize/%3E1010x/quality/90/src/shop/data/goodsview/\"]");
        Elements $detailInfo = document.select("div.css-kqvkc7.es6jciw1 img[src^=\"https://img-cf.kurly.com/hdims/resize/%3E1010x/quality/90/src/shop/data/goodsview/\"]");

        item.setImageUrl($itemImage.attr("src"));
        item.setTitle($title.text());
        item.setDetail($detail.text());
        item.setDcRate($dcRate.text());
        item.setDcPrice($dcPrice.text());
        item.setPrice($price.text());
        item.setDelivery($delivery.text());
        item.setSeller($seller.text());
        item.setPackaging($packaging.text());
        item.setDetailImage($detailImage.attr("src"));
        item.setWords($words.text());
        item.setKurlyCheck($kurlyCheck.attr("src"));
        item.setIsManual(false);
        item.setDetailInfo($detailInfo.attr("src"));

        // DB에 데이터 삽입
        int rowsInserted = itemMapper.insertItem(item);
        if (rowsInserted > 0) {
            return item;
        } else {
            return null;
        }
    }

    public CommonResult saveManualItem(ItemEntity itemEntity) {
        if (itemEntity == null) {
            return CommonResult.FAILURE;
        }

        itemEntity.setIsManual(true);
        int rowsInserted = itemMapper.insertItem(itemEntity);
        return rowsInserted > 0 ? CommonResult.SUCCESS : CommonResult.FAILURE;
    }

    public List<ItemEntity> getAllItems() {
        return itemMapper.selectAllItems();
    }

    public ItemEntity getItemByIndex(int index) {
        return itemMapper.selectItemByIndex(index);
    }

    public ItemEntity getProductByProductId(String productId) {
        return itemMapper.getItemByProductId(productId);
    }
}
