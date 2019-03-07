import { EventEmitter } from 'events';
import { IProtocol } from 'paseto.js';
import { PasetoFactory } from './PasetoFactory';
import { PasetoLocal } from './PasetoLocal';
import { PasetoPrivate } from './pasetoPrivate';
import { PasetoPublic } from './PasetoPublic';
import { PasetoVersion } from './PasetoVersion';

interface IKeys {public?: PasetoPublic<IProtocol>; private?: PasetoPrivate<IProtocol>; local?: PasetoLocal<IProtocol>; }

type FactoryFunc = (factory: PasetoFactory<IProtocol>) => Promise<IKeys>;

const eventListener = new EventEmitter();
const factory: Map<string|symbol, {factoryFunc: FactoryFunc, version: PasetoVersion}> = new Map();
const instances: Map<string|symbol, IKeys> = new Map();
const instantiationQueu: Set<string|symbol> = new Set();

const factories = {
    v1: PasetoFactory.createInstance('v1'),
    v2: PasetoFactory.createInstance('v2'),
};

export const addInstanceFactory = (name: string|symbol, factoryFunc: FactoryFunc, version?: PasetoVersion): void => {
    factory.set(name, {
        factoryFunc,
        version: version ? version : PasetoVersion.v2,
    });
};

export const getInstance = (name: string|symbol): Promise<IKeys> => {
    const instance = instances.get(name);
    if (instance) {
        return Promise.resolve(instance);
    }
    const factoryInfos = factory.get(name);
    if (!factoryInfos) {
        throw new Error('Unknown instance : ' + name.toString());
    }
    if (!instantiationQueu.has(name)) {
        instantiationQueu.add(name);
        return factoryInfos.factoryFunc(factories[factoryInfos.version])
        .then((paseto) => {
            if (paseto.private && paseto.private.hasPublicKey() && !paseto.public) {
                paseto.public = new PasetoPublic(
                    PasetoFactory.getVersion(factoryInfos.version),
                    paseto.private.publicKey()!,
                );
            }
            instances.set(name, paseto);
            eventListener.emit(name, paseto);
            return paseto;
        });
    }
    return new Promise((resolve) => {
        eventListener.once(name, resolve);
    });
};
