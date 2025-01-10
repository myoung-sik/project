package com.kms.test.mappers;

import com.kms.test.entities.ItemEntity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ItemMapper {
    int insertItem(ItemEntity itemEntity);

    ItemEntity selectItemByIndex(int index);

    List<ItemEntity> selectAllItems();

    int updateItem(ItemEntity item);

    int deleteItem(int index);

    ItemEntity getItemByProductId(String productId);
}
