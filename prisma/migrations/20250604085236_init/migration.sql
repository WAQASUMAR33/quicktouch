-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `isEmailVerified` BOOLEAN NOT NULL DEFAULT false,
    `verificationToken` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `sup_id` INTEGER NOT NULL AUTO_INCREMENT,
    `sup_name` VARCHAR(191) NOT NULL,
    `sup_address` VARCHAR(191) NOT NULL,
    `sup_phoneNo` VARCHAR(191) NOT NULL,
    `sup_taxNo` VARCHAR(191) NOT NULL,
    `sup_balance` DOUBLE NOT NULL DEFAULT 0.0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Supplier_sup_taxNo_key`(`sup_taxNo`),
    INDEX `Supplier_sup_taxNo_idx`(`sup_taxNo`),
    PRIMARY KEY (`sup_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dealer` (
    `dealer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `dealer_name` VARCHAR(191) NOT NULL,
    `dealer_address` VARCHAR(191) NOT NULL,
    `dealer_balance` DOUBLE NOT NULL DEFAULT 0.0,
    `dealer_city` VARCHAR(191) NOT NULL,
    `dealer_route` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`dealer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tax` (
    `tax_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tax_name` VARCHAR(191) NOT NULL,
    `tax_per` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`tax_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `p_id` INTEGER NOT NULL AUTO_INCREMENT,
    `p_title` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`p_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sale` (
    `sale_id` INTEGER NOT NULL AUTO_INCREMENT,
    `p_id` INTEGER NOT NULL,
    `amount_per_bag` DOUBLE NOT NULL,
    `no_of_bags` INTEGER NOT NULL,
    `total_weight` DOUBLE NOT NULL,
    `total_amount` DOUBLE NOT NULL,
    `tax_1` DOUBLE NULL DEFAULT 0.0,
    `tax_2` DOUBLE NULL DEFAULT 0.0,
    `tax_3` DOUBLE NULL DEFAULT 0.0,
    `net_total` DOUBLE NOT NULL,
    `vehicle_no` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Sale_p_id_idx`(`p_id`),
    PRIMARY KEY (`sale_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleDetails` (
    `sales_details_id` INTEGER NOT NULL AUTO_INCREMENT,
    `sales_id` INTEGER NOT NULL,
    `v_no` VARCHAR(191) NOT NULL,
    `p_id` INTEGER NOT NULL,
    `d_id` INTEGER NOT NULL,
    `no_of_bags` INTEGER NOT NULL,
    `unit_rate` DOUBLE NOT NULL,
    `freight` DOUBLE NOT NULL,
    `total_amount` DOUBLE NOT NULL,
    `tax_1` DOUBLE NULL DEFAULT 0.0,
    `tax_2` DOUBLE NULL DEFAULT 0.0,
    `tax_3` DOUBLE NULL DEFAULT 0.0,
    `total_amount_without_tax` DOUBLE NOT NULL,
    `total_amount_with_tax` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `SaleDetails_sales_id_idx`(`sales_id`),
    INDEX `SaleDetails_p_id_idx`(`p_id`),
    INDEX `SaleDetails_d_id_idx`(`d_id`),
    PRIMARY KEY (`sales_details_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupTrnx` (
    `trnx_id` INTEGER NOT NULL AUTO_INCREMENT,
    `sup_id` INTEGER NOT NULL,
    `pre_balance` DOUBLE NOT NULL,
    `amount_in` DOUBLE NOT NULL DEFAULT 0.0,
    `amount_out` DOUBLE NOT NULL DEFAULT 0.0,
    `balance` DOUBLE NOT NULL,
    `details` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `SupTrnx_sup_id_idx`(`sup_id`),
    PRIMARY KEY (`trnx_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DealerTrnx` (
    `trnx_id` INTEGER NOT NULL AUTO_INCREMENT,
    `d_id` INTEGER NOT NULL,
    `pre_balance` DOUBLE NOT NULL,
    `amount_in` DOUBLE NOT NULL DEFAULT 0.0,
    `amount_out` DOUBLE NOT NULL DEFAULT 0.0,
    `balance` DOUBLE NOT NULL,
    `details` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `DealerTrnx_d_id_idx`(`d_id`),
    PRIMARY KEY (`trnx_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_p_id_fkey` FOREIGN KEY (`p_id`) REFERENCES `Product`(`p_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleDetails` ADD CONSTRAINT `SaleDetails_sales_id_fkey` FOREIGN KEY (`sales_id`) REFERENCES `Sale`(`sale_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleDetails` ADD CONSTRAINT `SaleDetails_p_id_fkey` FOREIGN KEY (`p_id`) REFERENCES `Product`(`p_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleDetails` ADD CONSTRAINT `SaleDetails_d_id_fkey` FOREIGN KEY (`d_id`) REFERENCES `Dealer`(`dealer_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupTrnx` ADD CONSTRAINT `SupTrnx_sup_id_fkey` FOREIGN KEY (`sup_id`) REFERENCES `Supplier`(`sup_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DealerTrnx` ADD CONSTRAINT `DealerTrnx_d_id_fkey` FOREIGN KEY (`d_id`) REFERENCES `Dealer`(`dealer_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
