# Bitrix24 REST API client 
Данная библиотека реализует интерфейс взаимодействия с API Bitrix24 для Node.js

## Аутентификация
Доступно две стратегии аутентификации:

1. WebHookStrategy - по токену вебхука 
````JS
const whStrategy = new WebHookStrategy({
    portal: 'your portal host',
    user: 'app user id',
    token: 'app token'
});
````


2. OIDCStrategy - через протокол OIDC
````JS
const oidcStrategy = new OIDCStrategy({
    portal: 'your portal host',
    access_token: 'access token',
    refresh_token: 'refresh token',
    client_id: 'app client_id',
    client_secret: 'app client_secret',
    redirect_uri: 'app redirect_uri',
    onTokenUpdate: (client_id, tokenSet) => {
        //token refresh event handler
    }
});
````
Стратегия "OIDCStrategy" отслеживает срок жизни токена, и при необходимости делает запрос на продление. Параметр "onTokenUpdate" позволяет привязать обработчик события обновления пары токенов для дальнейшей работы с ними.

## Начало работы
Для начала работы с библиотекой необходимо создать экземпляр класса B24, который принимает стратегию аутентификации в качестве аргумента конструктора.

Запрос к методам API осуществляется через специальный метод "callMethod". Подробнее о доступных методах и параметрах запроса можно прочитать [в официальной документации](https://dev.1c-bitrix.ru/rest_help/)
````JS
const b24 = new B24(oidcStrategy);
const res = await b24.callMethod(
  'crm.company.list', 
  {filter: {'>ID': 10}
});
````

При необходимости возможна смена стратегии аутентификации "на лету": `b24.setStrategy(whStrategy);`.

## Обработка ответа
Библиотека анализирует полученные от API данные и возвращает один из двух доступных объекта ответа:
1. Response - "простой" ответ.
2. ResponseIterable - итерируемый для случаев, когда API возвращает выборку данных.

Оба класса имплементируют интерфейс IResponse и наследуют базовые методы для работы с ответом: `isSuccess: () => boolean`, `getError: () => string`, `getData: () => any`.  

### ResponseIterable
Экземпляр класса ResponseIterable при запросе данных возвращает итерируемый объект. Также для ResponseIterable реализована возможность постраничного запроса данных.

Пример работы с объектом:
````JS
// запрос данных
const companyRes = await b24.callMethod('crm.company.list', {filter: {'>ID': 10}});
const iterator = companyRes.getData();

// перебор результата
while (!iterator.isDone()) {
  let company = iterator.next();
}

// запрос следующей партии
if (companyRes.hasNextPage()) {
  const res = companyRes.nextPage(); 
}
````

## Batch-запросы
Библиотека реализует удобный интерфейс для формирования пакетных запросов к API через специальный метод "callBatch".
Пример работы с пакетным запросом:
````JS
const batchResponse = await b24.callBatch({
    user: {
        method: 'user.get',
        params: {filter: {">ID": 68}}
    },
    company: {
        'crm.company.list', 
        {filter: {'ID': 999}
    }
});
````
В результате будет возвращена структура типа `BatchResponse = { [key: string]: IResponse}`, где ключ соответствует ключу в параметрах запроса, а значение - объекту, имплементирующему интерфейс IResponse.


