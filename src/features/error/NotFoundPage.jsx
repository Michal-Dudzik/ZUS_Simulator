import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import notFoundImage from '../../assets/404_image.png';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <Result
      icon={
        <img
          src={notFoundImage}
          alt="Not Found"
          style={{ maxWidth: '100%', height: 'auto', maxHeight: '40vh' }}
        />
      }
      subTitle={t('general.notFound')}
      extra={
        <Link to="/">
          <Button type="primary">{t('general.backHome')}</Button>
        </Link>
      }
    />
  );
};

export default NotFoundPage; 