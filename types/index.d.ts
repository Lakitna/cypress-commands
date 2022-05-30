import './generic';
import './attribute';
import './then';
import './text';
import './to';

/// <reference types="cypress" />

// TODO: Update `request()` docs
// TODO: Update `then()` docs
// TODO: How to add to the Cyress config types
declare namespace Cypress {
    interface ResolvedConfigOptions<ComponentDevServerOpts = any> {
        requestBaseUrl: string | null;
    }
}
