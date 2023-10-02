odoo.define('dbs_pos_ensure_no_zero_qty.ProductScreenExtend', function (require) {
    'use strict';

    const ProductScreen = require('point_of_sale.ProductScreen');
    const Registries = require('point_of_sale.Registries');
    const { Gui } = require('point_of_sale.Gui');

	const ProductScreenExtend = (ProductScreen) =>
		class extends ProductScreen {
			constructor() {
				super(...arguments);
			}

        hasZeroQuantity() {
            let order = this.env.pos.get_order();
            let hasZero = false;
        
            for (let line of order.get_orderlines()) {
                if (line.get_quantity() === 0) {
                    hasZero = true;
                    break;
                }
            }
        
            return hasZero;
        }
        

        async _onClickPay() {
            if (this.hasZeroQuantity()) {
                await Gui.showPopup('ErrorPopup', {
                    title: ('Validation Error'),
                    body: ('Check and Remove Lines With Zero Qty'),
                });
            }
            else {
                await super._onClickPay();
            }
        }
    }

    Registries.Component.extend(ProductScreen, ProductScreenExtend);

    return ProductScreen;
});
