const Order = require('../models/Order');
const moment = require('moment');

class AnalyticsService {
    /**
     * Widget Engine: Dynamically builds MongoDB aggregation based on widget config
     * @param {Object} queryParams - { groupBy, metric, aggregation, dateRange }
     */
    async query(params) {
        const { groupBy = 'product', metric = 'totalAmount', aggregation = 'Sum', dateRange } = params;

        const pipeline = [];

        // 1. Date Filtering
        if (dateRange && dateRange !== 'All time') {
            const rangeLimits = {
                'Today': 0,
                'Last 7 Days': 7,
                'Last 30 Days': 30,
                'Last 90 Days': 90
            };
            const days = rangeLimits[dateRange] !== undefined ? rangeLimits[dateRange] : parseInt(dateRange);
            
            if (!isNaN(days)) {
                pipeline.push({
                    $match: {
                        createdAt: { 
                            $gte: moment().startOf('day').subtract(days, 'days').toDate() 
                        }
                    }
                });
            }
        }

        // 2. Mapping field names to schema fields
        const fieldMap = {
            'Product': 'product',
            'Status': 'status',
            'Created By': 'createdBy',
            'Order Date': 'createdAt',
            'Quantity': 'quantity',
            'Unit Price': 'unitPrice',
            'Total Amount': 'totalAmount',
            'Duration': 'duration'
        };

        const groupField = fieldMap[groupBy] || groupBy;
        const metricField = fieldMap[metric] || metric;

        // 3. Dynamic Aggregation
        const groupStage = { _id: `$${groupField}` };
        
        if (aggregation === 'Sum') {
            groupStage.value = { $sum: `$${metricField}` };
        } else if (aggregation === 'Average') {
            groupStage.value = { $avg: `$${metricField}` };
        } else if (aggregation === 'Count') {
            groupStage.value = { $count: {} };
        } else {
            groupStage.value = { $sum: `$${metricField}` }; // Default
        }

        pipeline.push({ $group: groupStage });

        // 4. Formatting output for Recharts { name, value }
        pipeline.push({
            $project: {
                name: "$_id",
                value: 1,
                _id: 0
            }
        });

        // 5. Sorting
        pipeline.push({ $sort: { name: 1 } });

        return await Order.aggregate(pipeline);
    }
}

module.exports = new AnalyticsService();
