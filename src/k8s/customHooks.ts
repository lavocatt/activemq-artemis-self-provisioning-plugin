import {
  Action,
  ExtensionHook,
  NodeKind,
  k8sGet,
  useDeleteModal,
  useK8sModel,
} from '@openshift-console/dynamic-plugin-sdk';
import { useMemo, useState } from 'react';
import { AMQBrokerModel, IngressDomainModel } from './models';
import { BrokerCR, Ingress } from './types';

export const useGetIngressDomain = (): {
  clusterDomain: string;
  isLoading: boolean;
  error: string;
} => {
  const [domain, setDomain] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const k8sGetBroker = () => {
    setLoading(true);
    k8sGet({ model: IngressDomainModel, name: 'cluster' })
      .then((ing: Ingress) => {
        setDomain(ing.spec.domain);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [isFirstMount, setIsFirstMount] = useState(true);
  if (isFirstMount) {
    k8sGetBroker();
    setIsFirstMount(false);
  }

  return { clusterDomain: domain, isLoading: loading, error: error };
};

export const useGetBrokerCR = (
  brokerName: string,
  namespace: string,
): { brokerCr: BrokerCR; isLoading: boolean; error: string } => {
  const [brokerDetails, setBrokerDetails] = useState<BrokerCR>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const k8sGetBroker = () => {
    setLoading(true);
    k8sGet({ model: AMQBrokerModel, name: brokerName, ns: namespace })
      .then((broker: BrokerCR) => {
        setBrokerDetails(broker as BrokerCR);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [isFirstMount, setIsFirstMount] = useState(true);
  if (isFirstMount) {
    k8sGetBroker();
    setIsFirstMount(false);
  }

  return { brokerCr: brokerDetails, isLoading: loading, error: error };
};

export const useHasCertManager = (): {
  hasCertManager: boolean;
  isLoading: boolean;
  error: string;
} => {
  const [isFirstMount, setIsFirstMount] = useState(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [hasCertManager, setHasCertManager] = useState(false);
  const [model] = useK8sModel({
    group: 'apiextensions.k8s.io',
    version: 'v1',
    kind: 'CustomResourceDefinition',
  });

  if (isFirstMount && model !== undefined) {
    k8sGet({
      model: model,
      name: 'certificates.cert-manager.io',
    })
      .then(
        () => {
          setHasCertManager(true);
        },
        (e) => {
          setError(e.message);
        },
      )
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
    setIsFirstMount(false);
  }
  return { hasCertManager: hasCertManager, isLoading: loading, error: error };
};

export const useProvideActiveMQArtemisActions: ExtensionHook<
  Action[],
  NodeKind
> = (obj) => {
  const [kindObj, inFlight] = useK8sModel({
    group: 'broker.amq.io',
    version: 'v1beta1',
    kind: 'ActiveMQArtemis',
  });
  const deleteModal = useDeleteModal(obj);
  const nodeActions = useMemo<Action[]>(() => {
    const actions: Action[] = [];
    actions.push({
      id: `delete-resource`,
      label: 'Delete Broker',
      cta: () => deleteModal(),
      accessReview: {
        group: kindObj.apiGroup,
        resource: kindObj.plural,
        name: obj.metadata.name,
        namespace: obj.metadata.namespace,
        verb: 'delete',
      },
    });

    return actions;
  }, [obj, deleteModal, kindObj]);

  return [nodeActions, !inFlight, undefined];
};
