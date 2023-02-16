import { QuestionCircleOutlined } from '@ant-design/icons';
import { SelectLang, useModel } from '@umijs/max';
import { Space, Modal } from 'antd';
import { historicalPrices } from '@/services/finmoddata/finmodapi';
import React, { useState } from 'react';
import HeaderSearch from '../HeaderSearch';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import moment from 'moment';
moment.locale('en');

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [modalOpen, openModal] = useState(false);
  const [processing, setProcessing] = useState<any | ''>(null);
  const [symbol, setSymbol] = useState('');
  const _setSymbol = (val: string) => {
    const sym = val.replace(/[^a-zA-Z]+/g, '');
    setSymbol(sym);
    console.log(symbol);
  };
  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'realDark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const getEquityData = (query: any) => {
    _setSymbol(query);
    historicalPrices({
      data: {
        symbol: symbol,
        email: initialState?.currentUser?.email,
        insert: { quota: { type: 'Research Model', date: moment().format() } },
      },
    }).then((histPricesRes: any) => {
      console.log(histPricesRes);
    });
  };

  return (
    <Space className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="symbol/tool"
        options={[]}
        onSearch={(value) => {
          console.log(value);
          setProcessing(value);
          openModal(true);
          getEquityData(value);
        }}
      />
      <span
        className={styles.action}
        onClick={() => {
          window.open('https://github.com/DylanAlloy/digits/issues');
        }}
      >
        <QuestionCircleOutlined />
      </span>
      <Avatar />
      <SelectLang className={styles.action} />
      <Modal
        title={processing ? processing : 'Loading'}
        centered
        open={modalOpen}
        onOk={() => openModal(false)}
        onCancel={() => openModal(false)}
      >
        {processing ? <p>not processing ${processing}</p> : <p>not processing ${processing}</p>}
      </Modal>
    </Space>
  );
};
export default GlobalHeaderRight;
