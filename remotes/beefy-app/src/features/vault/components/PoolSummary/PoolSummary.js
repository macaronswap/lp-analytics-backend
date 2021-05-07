import React from 'react';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js';
import { makeStyles } from '@material-ui/core/styles';

import { formatApy, formatTvl, calcDaily } from 'features/helpers/format';
import { byDecimals } from 'features/helpers/bignumber';
import styles from './styles';
import PoolPaused from './PoolPaused/PoolPaused';
import PoolTitle from './PoolTitle/PoolTitle';
import LabeledStat from './LabeledStat/LabeledStat';
import SummaryActions from './SummaryActions/SummaryActions';

const useStyles = makeStyles(styles);

const PoolSummary = ({
  pool,
  launchpool,
  toggleCard,
  isOpen,
  balanceSingle,
  sharesBalance,
  apy,
  fetchBalancesDone,
  fetchApysDone,
  fetchVaultsDataDone,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const vaultStateTitle = (status, paused) => {
    let state =
      status === 'eol'
        ? t('Vault-DepositsRetiredTitle')
        : paused
        ? t('Vault-DepositsPausedTitle')
        : null;

    if(launchpool) {
      state = 'Boosted by ' + launchpool.name
    }

    return state === null ? '' : <PoolPaused message={t(state)} isBoosted={!!launchpool} />;
  };

  return (
    <AccordionSummary
      className={
        pool.status === 'eol'
          ? classes.detailsRetired
          : pool.depositsPaused
          ? classes.detailsPaused
          : classes.details
      }
      style={{ justifyContent: 'space-between' }}
      onClick={event => {
        event.stopPropagation();
        toggleCard();
      }}
    >
      <Grid
        container
        alignItems="center"
        justify="space-around"
        spacing={1}
        style={{ paddingTop: '16px', paddingBottom: '16px' }}
      >
        {vaultStateTitle(pool.status, pool.depositsPaused)}
        <PoolTitle
          name={pool.name}
          logo={pool.logo}
          description={pool.tokenDescription}
          url={pool.tokenDescriptionUrl}
          launchpool={launchpool}
        />
        <Grid item md={7} xs={4}>
          <Grid item container justify="space-between">
            <Hidden smDown>
              <LabeledStat
                value={formatDecimals(balanceSingle)}
                label={t('Vault-Balance')}
                isLoading={!fetchBalancesDone}
                xs={5}
                md={3}
              />
              <LabeledStat
                value={formatDecimals(
                  byDecimals(
                    sharesBalance.multipliedBy(new BigNumber(pool.pricePerFullShare)),
                    pool.tokenDecimals
                  )
                )}
                label={t('Vault-Deposited')}
                isLoading={!fetchBalancesDone}
                xs={5}
                md={3}
                align="start"
              />
              <LabeledStat
                value={formatApy(apy)}
                label={t('Vault-APY')}
                boosted={launchpool ? formatApy(launchpool.apy + apy) : ''}
                isLoading={!fetchApysDone}
                xs={5}
                md={2}
                align="start"
              />
              <LabeledStat
                value={calcDaily(apy)}
                label={t('Vault-APYDaily')}
                boosted={launchpool ? calcDaily(launchpool.apy + apy) : ''}
                isLoading={!fetchApysDone}
                xs={5}
                md={2}
              />
              <LabeledStat
                value={formatTvl(pool.tvl, pool.oraclePrice)}
                label={t('Vault-TVL')}
                isLoading={!fetchVaultsDataDone}
                xs={5}
                md={2}
              />
            </Hidden>
          </Grid>
        </Grid>
        <SummaryActions
          helpUrl={pool.tokenDescriptionUrl}
          toggleCard={toggleCard}
          isOpen={isOpen}
        />

        <Hidden mdUp>
          <Grid item xs={12} style={{ display: 'flex' }} className={classes.mobilePadding}>
            <LabeledStat
              value={formatDecimals(balanceSingle)}
              label={t('Vault-Balance')}
              isLoading={!fetchBalancesDone}
              xs={6}
            />
            <LabeledStat
              value={formatDecimals(
                byDecimals(
                  sharesBalance.multipliedBy(new BigNumber(pool.pricePerFullShare)),
                  pool.tokenDecimals
                )
              )}
              label={t('Vault-Deposited')}
              xs={6}
              align="start"
            />
          </Grid>
          <Grid item xs={12} style={{ display: 'flex', paddingTop: '20px' }}>
            <LabeledStat
              value={formatApy(apy)}
              label={t('Vault-APY')}
              isLoading={!fetchApysDone}
              boosted={launchpool ? formatApy(launchpool.apy + apy) : ''}
              xs={4}
              align="start"
            />
            <LabeledStat
              value={calcDaily(apy)}
              label={t('Vault-APYDaily')}
              isLoading={!fetchApysDone}
              boosted={launchpool ? calcDaily(launchpool.apy + apy) : ''}
              xs={4}
            />
            <LabeledStat
              value={formatTvl(pool.tvl, pool.oraclePrice)}
              label={t('Vault-TVL')}
              isLoading={!fetchVaultsDataDone}
              xs={4}
            />
          </Grid>
        </Hidden>
      </Grid>
    </AccordionSummary>
  );
};

const formatDecimals = number => {
  return number >= 10 ? number.toFixed(4) : number.isEqualTo(0) ? 0 : number.toFixed(8);
};

export default PoolSummary;
