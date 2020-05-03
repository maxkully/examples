# 1. Выбрать для каждого клиента количество заказов ценой меньше 1000 и больше 1000. (client_id, count1, count2)

     SELECT lm.client_id, c.name, lm.count1, mm.count2
       FROM (SELECT count(*) count1, o.client_id FROM `orders` o WHERE o.price < 1000 GROUP BY o.client_id) AS lm
 INNER JOIN (SELECT count(*) count2, o.client_id FROM `orders` o WHERE o.price > 1000 GROUP BY o.client_id) AS mm
         ON lm.client_id = mm.client_id
 INNER JOIN `clients` c ON lm.client_id = c.id;

# 2. Выбрать третий заказ для каждого клиента ( id, client_id, price)

  SELECT *
    FROM (
            SELECT o.id,
                   @row_num := CASE WHEN @client_num = o.client_id
                                    THEN @row_num + 1
                                    ELSE 1
                               END AS num,
                   @client_num := o.client_id client_id,
                   o.price
              FROM `orders` o
        INNER JOIN `clients` c ON c.id = o.client_id,
                   (SELECT @client_num := 0, @row_num := 0) as t
          ORDER BY o.client_id, o.id
    ) AS ord
   WHERE ord.num = 3
ORDER BY ord.client_id;

# 3. Выбрать для каждого клиента третий заказ сделанный после заказа стоимостью больше 1000 (id, client_id, price)

  SELECT *
    FROM (
            SELECT @row_num := CASE
                                   WHEN @client_id = o.client_id AND o.price > 1000 THEN @row_num + 1
                                   WHEN @client_id = o.client_id AND @row_num != -1 THEN @row_num + 1
                                   WHEN @client_id != o.client_id AND o.price > 1000 THEN 0
                                   ELSE -1
                               END as num,
                   o.id,
                   @client_id := o.client_id `client_id`,
                   o.price
              FROM `orders` o
        INNER JOIN `clients` c ON c.id = o.client_id,
                   (SELECT @client_id := (SELECT cc.id FROM `clients` cc LIMIT 1), @row_num := -1) as t
          ORDER BY o.client_id, o.id
    ) AS ord
    WHERE ord.num = 3
ORDER BY ord.client_id, ord.id;
