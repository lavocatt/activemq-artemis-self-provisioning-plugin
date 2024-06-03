import { AddBrokerResourceValues } from './import-types';
import { K8sResourceKind, K8sResourceCommon as ArtemisCR } from '../../utils';
import { createContext } from 'react';
import { ConfigType } from '@app/configuration/broker-models';
import { SelectOptionObject } from '@patternfly/react-core';

export enum EditorType {
  BROKER = 'broker',
  YAML = 'yaml',
}

export enum ExposeMode {
  route = 'route',
  ingress = 'ingress',
}

export const BrokerConfigContext = createContext<AddBrokerResourceValues>({});
export const BrokerDispatchContext =
  createContext<React.Dispatch<ArtemisReducerActions>>(null);

export const addBrokerInitialValues = (
  namespace: string,
): AddBrokerResourceValues => {
  const initialFormData: ArtemisCR = {
    apiVersion: 'broker.amq.io/v1beta1',
    kind: 'ActiveMQArtemis',
    metadata: {
      name: 'ex-aao',
      namespace: namespace,
    },
    spec: {
      adminUser: 'admin',
      adminPassword: 'admin',
      console: {
        expose: true,
      },
      deploymentPlan: {
        image: 'placeholder',
        requireLogin: false,
        size: 1,
      },
    },
  };

  return {
    shouldShowYAMLMessage: true,
    editorType: EditorType.BROKER,
    yamlData: initialFormData,
  };
};

export const convertYamlToForm = (yamlBroker: K8sResourceKind) => {
  const { metadata } = yamlBroker;

  const newFormData = {
    ...yamlBroker,
    metadata: {
      ...metadata,
      name: metadata.name,
    },
    spec: yamlBroker.spec,
  };

  return newFormData;
};

// Reducer

type ArtemisReducerActionBase = {
  /** which transformation to apply onto the state */
  operation: ArtemisReducerOperations;
  /**
   * what data to apply onto the state, depends on the operation and can be
   * empty, check the related type description for more information on the
   * necessary fields to pass.
   */
  payload?: any;
};

type ArtemisReducerActions =
  | AddConfigToModelAction
  | DecrementReplicasAction
  | DeleteConfigAction
  | IncrementReplicasAction
  | SetBrokerNameAction
  | SetConsoleCredentialsAction
  | SetConsoleExposeAction
  | SetConsoleExposeModeAction
  | SetConsoleSSLEnabled
  | SetEditorTypeAction
  | UpdateConfigBindToAllInterfacesAction
  | UpdateConfigFactoryClassAction
  | UpdateConnectorHostAction
  | UpdateConfigNameAction
  | UpdateConfigOtherParamsAction
  | UpdateConfigPortAction
  | UpdateConfigProtocolsAction
  | UpdateConfigSSLEnabledAction
  | UpdateConfigSecretAction
  | UpdateNamespaceAction
  | UpdateReplicasNumberAction;

export enum ArtemisReducerOperations {
  addConfigToModel,
  decrementReplicas,
  deleteConfig,
  incrementReplicas,
  setBrokerName,
  setConsoleCredentials,
  setConsoleExpose,
  setConsoleExposeMode,
  setConsoleSSLEnabled,
  setEditorType,
  updateConfigBindToAllInterfaces,
  updateConfigFactoryClass,
  updateConnectorHost,
  updateConfigName,
  updateConfigOtherParams,
  updateConfigPort,
  updateConfigProtocols,
  updateConfigSSLEnabled,
  updateConfigSecret,
  updateNamespace,
  updateReplicasNumber,
}

interface AddConfigToModelAction extends ArtemisReducerActionBase {
  /** adds a new acceptor or connector to the cr */
  operation: ArtemisReducerOperations.addConfigToModel;
  /** the kind to add */
  payload: ConfigType.acceptors | ConfigType.connectors;
}

interface DecrementReplicasAction extends ArtemisReducerActionBase {
  /** decrements the total number of replicas by one */
  operation: ArtemisReducerOperations.decrementReplicas;
}

export type DeleteConfigActionPayload = {
  /** the name of the configuration */
  configName: string;
  /** the type of the configuration*/
  configType: ConfigType.acceptors | ConfigType.connectors;
};

interface DeleteConfigAction extends ArtemisReducerActionBase {
  /** delete an acceptor or connector of the cr */
  operation: ArtemisReducerOperations.deleteConfig;
  /** a way to discimate which one */
  payload: DeleteConfigActionPayload;
}

interface IncrementReplicasAction extends ArtemisReducerActionBase {
  /** increment the total number of replicas by one */
  operation: ArtemisReducerOperations.incrementReplicas;
}

interface SetBrokerNameAction extends ArtemisReducerActionBase {
  /** updates the broker name */
  operation: ArtemisReducerOperations.setBrokerName;
  /** the name of the broker */
  payload: string;
}

export type ConsoleCredentialsPayload = {
  /** the username to login to the console */
  adminUser: string;
  /** the password to login to the console */
  adminPassword: string;
};

interface SetConsoleCredentialsAction extends ArtemisReducerActionBase {
  /** Updates the console credentials */
  operation: ArtemisReducerOperations.setConsoleCredentials;
  /** the new credentials */
  payload: ConsoleCredentialsPayload;
}

interface SetConsoleExposeAction extends ArtemisReducerActionBase {
  /** set is the console is exposed or not */
  operation: ArtemisReducerOperations.setConsoleExpose;
  /** is the console exposed */
  payload: boolean;
}

interface SetConsoleExposeModeAction extends ArtemisReducerActionBase {
  /** changes the expose mode of the console */
  operation: ArtemisReducerOperations.setConsoleExposeMode;
  /** how is the console exposed */
  payload: ExposeMode;
}

interface SetConsoleSSLEnabled extends ArtemisReducerActionBase {
  /** set if the console has ssl enabled or not */
  operation: ArtemisReducerOperations.setConsoleSSLEnabled;
  /** is ssl enabled for the console */
  payload: boolean;
}

interface SetEditorTypeAction extends ArtemisReducerActionBase {
  /** set the desire editor type for the user interface */
  operation: ArtemisReducerOperations.setEditorType;
  /* What editor the user wants to use */
  payload: EditorType;
}

export type UpdateConfigBindToAllInterfacesPayload = {
  /** the type of the configuration */
  configType: ConfigType.acceptors | ConfigType.connectors;
  /** the name of the configuration */
  configName: string;
  /** bind to all the interfaces or not*/
  bindToAllInterfaces: boolean;
};

interface UpdateConfigBindToAllInterfacesAction
  extends ArtemisReducerActionBase {
  /** Sets if the configuration should bind to all the interfaces or not */
  operation: ArtemisReducerOperations.updateConfigBindToAllInterfaces;
  payload: UpdateConfigBindToAllInterfacesPayload;
}

export type UpdateConfigFactoryClassPayload = {
  /** the type of the configuration */
  configType: ConfigType;
  /** the name of the configuration */
  configName: string;
  /** the java class to set */
  selectedClass: string;
};

interface UpdateConfigFactoryClassAction extends ArtemisReducerActionBase {
  /** Updates the configuration's factory Class */
  operation: ArtemisReducerOperations.updateConfigFactoryClass;
  payload: UpdateConfigFactoryClassPayload;
}

export type UpdateConnectorHostPayload = {
  /** the name of the configuration */
  connectorName: string;
  /** the new host of the configuration */
  host: string;
};

interface UpdateConnectorHostAction extends ArtemisReducerActionBase {
  /** Updates the Connector's host */
  operation: ArtemisReducerOperations.updateConnectorHost;
  payload: UpdateConnectorHostPayload;
}

export type RenameConfigPayload = {
  /** the name of the configuration */
  configName: string;
  /** the type of the configuration */
  configType: ConfigType.acceptors | ConfigType.connectors;
  /** the new name of the configuration */
  newName: string;
};

interface UpdateConfigNameAction extends ArtemisReducerActionBase {
  /** Renames an acceptor or a connector */
  operation: ArtemisReducerOperations.updateConfigName;
  payload: RenameConfigPayload;
}

export type UpdateConfigOtherParamsPayload = {
  /** the type of the configuration */
  configType: ConfigType.acceptors | ConfigType.connectors;
  /** the name of the configuration */
  configName: string;
  /** a comma separated list of extra parameters */
  otherParams: string;
};

interface UpdateConfigOtherParamsAction extends ArtemisReducerActionBase {
  /** Updates any other parameters for the acceptor or connector */
  operation: ArtemisReducerOperations.updateConfigOtherParams;
  payload: UpdateConfigOtherParamsPayload;
}

export type UpdateConfigPortPayload = {
  /** the type of the configuration */
  configType: ConfigType.acceptors | ConfigType.connectors;
  /** the name of the configuration */
  configName: string;
  /** the new port of the configuration */
  port: number;
};

interface UpdateConfigPortAction extends ArtemisReducerActionBase {
  /** Updates the port of an acceptor or connector */
  operation: ArtemisReducerOperations.updateConfigPort;
  payload: UpdateConfigPortPayload;
}

export type UpdateConfigProtocolsPayload = {
  /** the type of the configuration */
  configType: ConfigType.connectors | ConfigType.acceptors;
  /** the name of the configuration */
  configName: string;
  /** A comma separated list of protocols */
  protocols: string;
};

interface UpdateConfigProtocolsAction extends ArtemisReducerActionBase {
  /** Updates the supported protocols for the acceptor or connector */
  operation: ArtemisReducerOperations.updateConfigProtocols;
  payload: UpdateConfigProtocolsPayload;
}

export type UpdateConfigSSLEnabledPayload = {
  /** the type of the configuration */
  configType: ConfigType.acceptors | ConfigType.connectors;
  /** the name of the configuration */
  configName: string;
  /** if ssl is enabled or not */
  sslEnabled: boolean;
};

interface UpdateConfigSSLEnabledAction extends ArtemisReducerActionBase {
  /** Sets if SSL is enabled or not for a given acceptor of connector */
  operation: ArtemisReducerOperations.updateConfigSSLEnabled;
  payload: UpdateConfigSSLEnabledPayload;
}

export type UpdateConfigSecretPayload = {
  /** the type of the configuration (acceptor, connector or console) */
  configType: ConfigType;
  /** the name of the configuration */
  configName: string;
  /** the secret of the configuration */
  secret: SelectOptionObject;
  /** the secret is a certificate */
  isCa: boolean;
};

interface UpdateConfigSecretAction extends ArtemisReducerActionBase {
  /** Renames an acceptor or a connector */
  operation: ArtemisReducerOperations.updateConfigSecret;
  payload: UpdateConfigSecretPayload;
}

interface UpdateNamespaceAction extends ArtemisReducerActionBase {
  /** update the namespace of the CR */
  operation: ArtemisReducerOperations.updateNamespace;
  /** the new namespace for the CR */
  payload: string;
}

interface UpdateReplicasNumberAction extends ArtemisReducerActionBase {
  /** update the total number of replicas */
  operation: ArtemisReducerOperations.updateReplicasNumber;
  /** the total number of replicas */
  payload: number;
}

/**
 *
 * The core of the reducer functionality. Switch case on the Action and apply
 * its effects on a copy of the state. Must return the copy of the state after
 * the modifications are applied
 *
 */
export const artemisCrReducer: React.Reducer<
  AddBrokerResourceValues,
  ArtemisReducerActions
> = (prevBrokerModel, action) => {
  const brokerModel = { ...prevBrokerModel };

  // set the individual fields
  switch (action.operation) {
    case ArtemisReducerOperations.setEditorType:
      brokerModel.editorType = action.payload;
      break;
    case ArtemisReducerOperations.updateNamespace:
      brokerModel.yamlData.metadata.namespace = action.payload;
      break;
    case ArtemisReducerOperations.updateReplicasNumber:
      brokerModel.yamlData.spec.deploymentPlan.size = action.payload;
      break;
    case ArtemisReducerOperations.incrementReplicas:
      brokerModel.yamlData.spec.deploymentPlan.size += 1;
      break;
    case ArtemisReducerOperations.decrementReplicas:
      brokerModel.yamlData.spec.deploymentPlan.size -= 1;
      break;
    case ArtemisReducerOperations.setBrokerName:
      brokerModel.yamlData.metadata.name = action.payload;
      break;
    case ArtemisReducerOperations.addConfigToModel:
      addConfig(brokerModel.yamlData, action.payload);
      break;
    case ArtemisReducerOperations.deleteConfig:
      deleteConfig(
        brokerModel.yamlData,
        action.payload.configType,
        action.payload.configName,
      );
      break;
    case ArtemisReducerOperations.updateConfigName:
      renameConfig(
        brokerModel.yamlData,
        action.payload.configType,
        action.payload.configName,
        action.payload.newName,
      );
      break;
    case ArtemisReducerOperations.updateConfigSecret:
      updateConfigSecret(
        brokerModel.yamlData,
        action.payload.configType,
        action.payload.secret,
        action.payload.configName,
        action.payload.isCa,
      );
      break;
    case ArtemisReducerOperations.setConsoleSSLEnabled:
      brokerModel.yamlData.spec.console.sslEnabled = action.payload;
      break;
    case ArtemisReducerOperations.setConsoleExposeMode:
      brokerModel.yamlData.spec.console.exposeMode = action.payload;
      break;
    case ArtemisReducerOperations.setConsoleExpose:
      brokerModel.yamlData.spec.console.expose = action.payload;
      break;
    case ArtemisReducerOperations.setConsoleCredentials:
      brokerModel.yamlData.spec.console.adminUser = action.payload.adminUser;
      brokerModel.yamlData.spec.console.adminPassword =
        action.payload.adminPassword;
      break;
    case ArtemisReducerOperations.updateConfigPort:
      updateConfigPort(
        brokerModel.yamlData,
        action.payload.configType,
        action.payload.configName,
        action.payload.port,
      );
      break;
    case ArtemisReducerOperations.updateConnectorHost:
      updateConnectorHost(
        brokerModel.yamlData,
        action.payload.connectorName,
        action.payload.host,
      );
      break;
    case ArtemisReducerOperations.updateConfigBindToAllInterfaces:
      updateConfigBindToAllInterfaces(
        brokerModel.yamlData,
        action.payload.configType,
        action.payload.configName,
        action.payload.bindToAllInterfaces,
      );
      break;
    case ArtemisReducerOperations.updateConfigProtocols:
      updateConfigProtocols(
        brokerModel.yamlData,
        action.payload.configType,
        action.payload.configName,
        action.payload.protocols,
      );
      break;
    case ArtemisReducerOperations.updateConfigOtherParams:
      updateConfigOtherParams(
        brokerModel.yamlData,
        action.payload.configType,
        action.payload.configName,
        action.payload.otherParams,
      );
      break;
    case ArtemisReducerOperations.updateConfigSSLEnabled:
      updateConfigSSLEnabled(
        brokerModel.yamlData,
        action.payload.configType,
        action.payload.configName,
        action.payload.sslEnabled,
      );
      break;
    case ArtemisReducerOperations.updateConfigFactoryClass:
      updateConfigFactoryClass(
        brokerModel.yamlData,
        action.payload.configType,
        action.payload.configName,
        action.payload.selectedClass,
      );
      break;
    default:
      throw Error('Unknown action: ' + action);
  }

  return brokerModel;
};

const generateUniqueName = (prefix: string, existing: Set<string>): string => {
  const limit = existing.size + 1;
  let newName;
  for (let i = 0; i < limit; i++) {
    newName = prefix + i;
    if (!existing.has(newName)) {
      break;
    }
  }
  return newName;
};

const initSpec = (yamlData: ArtemisCR) => {
  if (!yamlData.spec.connectors) {
    yamlData.spec.connectors = [];
  }
};

const addConfig = (yamlData: ArtemisCR, configType: ConfigType) => {
  if (!yamlData.spec.brokerProperties) {
    yamlData.spec.brokerProperties = [];
  }

  const acceptorSet = listConfigs(configType, yamlData, 'set') as Set<string>;

  const newName = generateUniqueName(configType, acceptorSet);

  if (configType === ConfigType.connectors) {
    initSpec(yamlData);
    yamlData.spec.connectors.push({
      name: newName,
      protocols: 'ALL',
      host: 'localhost',
      port: 5555,
    });
  } else {
    if (!yamlData.spec.acceptors) {
      yamlData.spec.acceptors = [];
    }
    yamlData.spec.acceptors.push({
      name: newName,
      protocols: 'ALL',
      port: 5555,
    });
  }

  const prefix =
    configType === ConfigType.connectors
      ? 'connectorConfigurations.'
      : 'acceptorConfigurations.';

  yamlData.spec.brokerProperties.push(
    prefix +
      newName +
      '.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.netty.NettyAcceptorFactory',
  );
};

const deleteConfig = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
) => {
  const prefix =
    configType === ConfigType.connectors
      ? 'connectorConfigurations.'
      : 'acceptorConfigurations.';
  if (brokerModel.spec?.brokerProperties?.length > 0) {
    const configKey = prefix + configName + '.';
    brokerModel.spec.brokerProperties =
      brokerModel.spec.brokerProperties.filter((x: string) => {
        return !x.startsWith(configKey);
      });
    if (configType === ConfigType.connectors) {
      if (brokerModel.spec?.connectors?.length > 0) {
        brokerModel.spec.connectors = brokerModel.spec.connectors.filter(
          (x: { name: string }) => {
            return x.name !== configName;
          },
        );
      }
    } else {
      if (brokerModel.spec?.acceptors?.length > 0) {
        brokerModel.spec.acceptors = brokerModel.spec.acceptors.filter(
          (x: { name: string }) => {
            return x.name !== configName;
          },
        );
      }
    }
  }
};

const renameConfig = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  previousName: string,
  newName: string,
) => {
  const prefix =
    configType === ConfigType.connectors
      ? 'connectorConfigurations.'
      : 'acceptorConfigurations.';
  if (brokerModel.spec?.brokerProperties?.length > 0) {
    const configKey = prefix + previousName + '.';
    const newKey = prefix + newName + '.';
    brokerModel.spec.brokerProperties = brokerModel.spec.brokerProperties.map(
      (o: string) => {
        if (o.startsWith(configKey)) {
          return o.replace(configKey, newKey);
        }
        return o;
      },
    );

    if (configType === ConfigType.connectors) {
      if (brokerModel.spec?.connectors?.length > 0) {
        brokerModel.spec.connectors = brokerModel.spec.connectors.map(
          (o: { name: string }) => {
            if (o.name === previousName) {
              return { ...o, name: newName };
            }
            return o;
          },
        );
      }
    } else {
      if (brokerModel.spec?.acceptors?.length > 0) {
        brokerModel.spec.acceptors = brokerModel.spec.acceptors.map(
          (o: { name: string }) => {
            if (o.name === previousName) {
              return { ...o, name: newName };
            }
            return o;
          },
        );
      }
    }
  }
};

const updateConfigSecret = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  secret: SelectOptionObject,
  configName: string,
  isCa: boolean,
) => {
  console.log('updating model with secret', secret);
  if (configType === ConfigType.connectors) {
    if (brokerModel.spec?.connectors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
        if (brokerModel.spec.connectors[i].name === configName) {
          if (isCa) {
            if (secret) {
              brokerModel.spec.connectors[i].trustSecret = secret.toString();
            } else {
              delete brokerModel.spec.connectors[i].trustSecret;
            }
          } else {
            if (secret) {
              brokerModel.spec.connectors[i].sslSecret = secret.toString();
            } else {
              delete brokerModel.spec.connectors[i].sslSecret;
            }
          }
        }
      }
    }
  } else if (configType === ConfigType.acceptors) {
    console.log('upate for acceptor', configName);
    if (brokerModel.spec?.acceptors?.length > 0) {
      console.log('has some acceptor already');
      for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
        if (brokerModel.spec.acceptors[i].name === configName) {
          console.log('found selector, selected', secret);
          if (isCa) {
            if (secret) {
              brokerModel.spec.acceptors[i].trustSecret = secret.toString();
            } else {
              delete brokerModel.spec.acceptors[i].trustSecret;
            }
          } else {
            console.log('is cert', secret);
            if (secret) {
              brokerModel.spec.acceptors[i].sslSecret = secret.toString();
            } else {
              delete brokerModel.spec.acceptors[i].sslSecret;
            }
          }
        }
      }
    }
  } else {
    if (brokerModel.spec?.console) {
      if (isCa) {
        if (secret) {
          brokerModel.spec.console.trustSecret = secret.toString();
        } else {
          delete brokerModel.spec.console.trustSecret;
        }
      } else {
        if (secret) {
          brokerModel.spec.console.sslSecret = secret.toString();
        } else {
          delete brokerModel.spec.console.sslSecret;
        }
      }
    }
  }
};

const updateConfigPort = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
  port: number,
): void => {
  if (configType === ConfigType.connectors) {
    if (brokerModel.spec?.connectors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
        if (brokerModel.spec.connectors[i].name === configName) {
          brokerModel.spec.connectors[i].port = port;
        }
      }
    }
  } else {
    if (brokerModel.spec?.acceptors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
        if (brokerModel.spec.acceptors[i].name === configName) {
          brokerModel.spec.acceptors[i].port = port;
        }
      }
    }
  }
};

const updateConnectorHost = (
  brokerModel: ArtemisCR,
  connectorName: string,
  host: string,
): void => {
  if (brokerModel.spec?.connectors?.length > 0) {
    for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
      if (brokerModel.spec.connectors[i].name === connectorName) {
        brokerModel.spec.connectors[i].host = host;
      }
    }
  }
};

const updateConfigBindToAllInterfaces = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
  bindToAllInterfaces: boolean,
): void => {
  console.log('calling update bindto', configName, 'type', configType);
  if (
    configType === ConfigType.acceptors &&
    brokerModel.spec?.acceptors?.length > 0
  ) {
    console.log('updating bindto on acceptor', configName);
    for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
      if (brokerModel.spec.acceptors[i].name === configName) {
        console.log('found update', bindToAllInterfaces);
        brokerModel.spec.acceptors[i].bindToAllInterfaces = bindToAllInterfaces;
      }
    }
  }
};

const updateConfigProtocols = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
  protocols: string,
): void => {
  if (configType === ConfigType.connectors) {
    if (brokerModel.spec?.connectors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
        if (brokerModel.spec.connectors[i].name === configName) {
          brokerModel.spec.connectors[i].protocols = protocols;
        }
      }
    }
  } else {
    if (brokerModel.spec?.acceptors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
        if (brokerModel.spec.acceptors[i].name === configName) {
          brokerModel.spec.acceptors[i].protocols = protocols;
        }
      }
    }
  }
};

const updateConfigOtherParams = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
  otherParams: string,
): void => {
  const getOtherParamsMap = (otherParams: string): Map<string, string> => {
    const pMap = new Map<string, string>();
    const params = otherParams.split(',');
    if (params?.length > 0) {
      params.forEach((p) => {
        const [pk, pv] = p.split('=');
        if (pk && pv) {
          pMap.set(pk, pv);
        }
      });
    }
    return pMap;
  };
  const isOtherParam = (pname: string): boolean => {
    return (
      pname !== 'port' &&
      pname !== 'protocols' &&
      pname !== 'host' &&
      pname !== 'bindToAllInterfaces' &&
      pname !== 'sslEnabled' &&
      pname !== 'sslSecret'
    );
  };
  //const paramSet = new Set<string>(otherParams.split(','));
  const paramMap = getOtherParamsMap(otherParams);
  const paramPrefix = getConfigParamKey(configType, configName);
  if (brokerModel.spec?.brokerProperties?.length > 0) {
    //update
    for (let i = 0; i < brokerModel.spec.brokerProperties.length; i++) {
      if (brokerModel.spec.brokerProperties[i].startsWith(paramPrefix)) {
        const param = brokerModel.spec.brokerProperties[i].substring(
          paramPrefix.length,
        );
        const [paramName] = param.split('=');
        if (isOtherParam(paramName)) {
          if (paramMap.has(paramName)) {
            //update
            brokerModel.spec.brokerProperties[i] =
              paramPrefix + paramName + '=' + paramMap.get(paramName);
            paramMap.delete(paramName);
          } else {
            //mark for deletion
            brokerModel.spec.brokerProperties[i] = 'mark-to-delete';
          }
        }
      }
    }
    //remove
    brokerModel.spec.brokerProperties =
      brokerModel.spec.brokerProperties.filter((x: string) => {
        return x !== 'mark-to-delete';
      });
  }
  //now new params
  paramMap.forEach((v, k) => {
    brokerModel.spec.brokerProperties.push(paramPrefix + k + '=' + v);
  });
};

const updateConfigSSLEnabled = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
  isSSLEnabled: boolean,
): void => {
  if (configType === ConfigType.connectors) {
    if (brokerModel.spec?.connectors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
        if (brokerModel.spec.connectors[i].name === configName) {
          brokerModel.spec.connectors[i].sslEnabled = isSSLEnabled;
          if (!isSSLEnabled) {
            //remove trust and ssl secrets
            delete brokerModel.spec.connectors[i].sslSecret;
            delete brokerModel.spec.connectors[i].trustSecret;
          }
        }
      }
    }
  } else {
    if (brokerModel.spec?.acceptors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
        if (brokerModel.spec.acceptors[i].name === configName) {
          brokerModel.spec.acceptors[i].sslEnabled = isSSLEnabled;
          if (!isSSLEnabled) {
            //remove trust and ssl secrets
            delete brokerModel.spec.acceptors[i].sslSecret;
            delete brokerModel.spec.acceptors[i].trustSecret;
          }
        }
      }
    }
  }
};

const updateConfigFactoryClass = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
  selectedClass: string,
): void => {
  const getConfigPrefix = (configType: ConfigType) => {
    if (configType === ConfigType.connectors) {
      return 'connectorConfigurations.';
    }
    return 'acceptorConfigurations.';
  };
  for (let i = 0; i < brokerModel.spec.brokerProperties.length; i++) {
    const configPrefix = getConfigPrefix(configType);
    if (brokerModel.spec.brokerProperties[i].startsWith(configPrefix)) {
      const fields = brokerModel.spec.brokerProperties[i].split('.', 3);
      if (fields.length === 3) {
        if (
          fields[1] === configName &&
          fields[2].startsWith('factoryClassName=')
        ) {
          if (selectedClass === 'invm') {
            brokerModel.spec.brokerProperties[i] =
              configPrefix +
              configName +
              '.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.invm.InVMAcceptorFactory';
          } else {
            brokerModel.spec.brokerProperties[i] =
              configPrefix +
              configName +
              '.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.netty.NettyAcceptorFactory';
          }
          break;
        }
      }
    }
  }
};

// Getters

export const getConfigSecret = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
  isCa: boolean,
): SelectOptionObject => {
  const newOptionObject = (value: string): SelectOptionObject => {
    return {
      toString() {
        return value;
      },
    };
  };
  console.log('getting secret from yaml', configName, 'idCa', isCa);
  if (configType === ConfigType.connectors) {
    if (brokerModel.spec?.connectors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
        if (brokerModel.spec.connectors[i].name === configName) {
          if (isCa) {
            if (brokerModel.spec.connectors[i].trustSecret) {
              return newOptionObject(
                brokerModel.spec.connectors[i].trustSecret,
              );
            }
          } else if (brokerModel.spec.connectors[i].sslSecret) {
            return newOptionObject(brokerModel.spec.connectors[i].sslSecret);
          }
        }
      }
    }
  } else if (configType === ConfigType.acceptors) {
    console.log('looking for acceptor secrets');
    if (brokerModel.spec?.acceptors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
        console.log('acceptor ' + i + brokerModel.spec.acceptors[i].name);
        if (brokerModel.spec.acceptors[i].name === configName) {
          console.log('name matches');
          if (isCa) {
            console.log('for ca');
            if (brokerModel.spec.acceptors[i].trustSecret) {
              return newOptionObject(brokerModel.spec.acceptors[i].trustSecret);
            }
          } else if (brokerModel.spec.acceptors[i].sslSecret) {
            console.log('for ssl' + brokerModel.spec.acceptors[i].sslSecret);
            return newOptionObject(brokerModel.spec.acceptors[i].sslSecret);
          }
        }
      }
    }
  } else {
    console.log('console secret');
    if (isCa) {
      if (brokerModel.spec.console.trustSecret) {
        return newOptionObject(brokerModel.spec.console.trustSecret);
      }
    } else if (brokerModel.spec.console.sslSecret) {
      return newOptionObject(brokerModel.spec.console.sslSecret);
    }
  }
  console.log('nothing found');
  return '';
};

export const getConfigFactoryClass = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
): string => {
  if (brokerModel.spec?.brokerProperties?.length > 0) {
    for (let i = 0; i < brokerModel.spec.brokerProperties.length; i++) {
      const prefix =
        configType === ConfigType.connectors
          ? 'connectorConfigurations.'
          : 'acceptorConfigurations.';
      if (brokerModel.spec.brokerProperties[i].startsWith(prefix)) {
        const fields = brokerModel.spec.brokerProperties[i].split('.', 3);
        if (fields.length === 3) {
          if (
            fields[1] === configName &&
            fields[2].startsWith('factoryClassName=')
          ) {
            const elems = brokerModel.spec.brokerProperties[i].split('=', 2);
            if (
              elems[1] ===
              'org.apache.activemq.artemis.core.remoting.impl.invm.InVMAcceptorFactory'
            ) {
              return 'invm';
            }
          }
        }
      }
    }
  }
  return 'netty';
};

export const getConfigPort = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
): number => {
  if (configType === ConfigType.connectors) {
    if (brokerModel.spec?.connectors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
        if (brokerModel.spec.connectors[i].name === configName) {
          return brokerModel.spec.connectors[i].port;
        }
      }
    }
  } else {
    if (brokerModel.spec?.acceptors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
        if (brokerModel.spec.acceptors[i].name === configName) {
          return brokerModel.spec.acceptors[i].port;
        }
      }
    }
  }
  return 5555;
};

export const getConfigHost = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
): string => {
  if (configType === ConfigType.connectors) {
    if (brokerModel.spec?.connectors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
        if (brokerModel.spec.connectors[i].name === configName) {
          return brokerModel.spec.connectors[i].host;
        }
      }
    }
  }
  return 'localhost';
};

export const getConfigProtocols = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
): string => {
  if (configType === ConfigType.connectors) {
    if (brokerModel.spec?.connectors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
        if (brokerModel.spec.connectors[i].name === configName) {
          return brokerModel.spec.connectors[i].protocols;
        }
      }
    }
  } else {
    if (brokerModel.spec?.acceptors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
        if (brokerModel.spec.acceptors[i].name === configName) {
          return brokerModel.spec.acceptors[i].protocols;
        }
      }
    }
  }
  return 'ALL';
};

export const getConfigBindToAllInterfaces = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
): boolean => {
  if (configType === ConfigType.acceptors) {
    console.log('getting aceptor bindto', configName);
    if (brokerModel.spec?.acceptors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
        if (brokerModel.spec.acceptors[i].name === configName) {
          console.log(
            'found it type is',
            typeof brokerModel.spec.acceptors[i].bindToAllInterfaces,
          );
          return brokerModel.spec.acceptors[i].bindToAllInterfaces
            ? true
            : false;
        }
      }
    }
  }
  return false;
};

const getConfigParamKey = (
  configType: ConfigType,
  configName: string,
): string => {
  if (configType === ConfigType.connectors) {
    return 'connectorConfigurations.' + configName + '.params.';
  }
  return 'acceptorConfigurations.' + configName + '.params.';
};

export const getConfigOtherParams = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
): string => {
  const params: string[] = [];
  if (brokerModel.spec?.brokerProperties?.length > 0) {
    for (let i = 0; i < brokerModel.spec.brokerProperties.length; i++) {
      const paramKey = getConfigParamKey(configType, configName);
      if (brokerModel.spec.brokerProperties[i].startsWith(paramKey)) {
        const portKey = paramKey + 'port=';
        const protKey = paramKey + 'protocols=';
        if (
          !brokerModel.spec.brokerProperties[i].startsWith(portKey) &&
          !brokerModel.spec.brokerProperties[i].startsWith(protKey)
        ) {
          const fields = brokerModel.spec.brokerProperties[i].split('=', 2);
          const pName = fields[0].split('.')[3];
          params.push(pName + '=' + fields[1]);
        }
      }
    }
  }
  return params.toString();
};

export const listConfigs = (
  configType: ConfigType,
  brokerModel: ArtemisCR,
  resultType?: string,
): { name: string }[] | Set<string> => {
  const acceptors = new Set<string>();
  if (configType === ConfigType.connectors) {
    if (brokerModel.spec?.connectors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
        acceptors.add(brokerModel.spec.connectors[i].name);
      }
    }
  } else {
    if (brokerModel.spec?.acceptors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
        acceptors.add(brokerModel.spec.acceptors[i].name);
      }
    }
  }
  if (resultType === 'set') {
    return acceptors;
  }
  const result: { name: string }[] = [];
  acceptors.forEach((value) => result.push({ name: value }));
  return result;
};

export const getConfigSSLEnabled = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
): boolean => {
  if (configType === ConfigType.connectors) {
    if (brokerModel.spec?.connectors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
        if (brokerModel.spec.connectors[i].name === configName) {
          return brokerModel.spec.connectors[i].sslEnabled ? true : false;
        }
      }
    }
  } else {
    if (brokerModel.spec?.acceptors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
        if (brokerModel.spec.acceptors[i].name === configName) {
          return brokerModel.spec.acceptors[i].sslEnabled ? true : false;
        }
      }
    }
  }
  return false;
};
