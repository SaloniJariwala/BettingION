import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const StrictTransportSecurity = () => {
  useEffect(() => {
    if (window.location.protocol !== 'https:') {
      window.location.href = `https://${window.location.hostname}${window.location.pathname}`;
    }
  }, []);

  return (
    <Helmet>
      <meta http-equiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains" />
    </Helmet>
  );
};

export default StrictTransportSecurity;