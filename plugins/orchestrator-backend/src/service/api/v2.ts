import { ParsedRequest } from 'openapi-backend';

import {
  AssessedProcessInstance,
  AssessedProcessInstanceDTO,
  ProcessInstancesDTO,
  WorkflowDTO,
  WorkflowListResult,
  WorkflowListResultDTO,
  WorkflowOverviewDTO,
  WorkflowOverviewListResultDTO,
} from '@janus-idp/backstage-plugin-orchestrator-common';

import { DataIndexService } from '../DataIndexService';
import { SonataFlowService } from '../SonataFlowService';
import {
  mapToProcessInstanceDTO,
  mapToWorkflowDTO,
  mapToWorkflowListResultDTO,
  mapToWorkflowOverviewDTO,
} from './mapping/V2Mappings';
import { V1 } from './v1';

export namespace V2 {
  export async function getWorkflowOverview(
    sonataFlowService: SonataFlowService,
  ): Promise<WorkflowOverviewListResultDTO> {
    const overviewsV1 = await V1.getWorkflowOverview(sonataFlowService);
    const result: WorkflowOverviewListResultDTO = {
      overviews: overviewsV1.items.map(item => mapToWorkflowOverviewDTO(item)),
      paginationInfo: {
        limit: 0,
        offset: 0,
        totalCount: overviewsV1.items?.length ?? 0,
      },
    };
    return result;
  }

  export async function getWorkflowOverviewById(
    sonataFlowService: SonataFlowService,
    workflowId: string,
  ): Promise<WorkflowOverviewDTO> {
    const overviewV1 =
      await sonataFlowService.fetchWorkflowOverview(workflowId);

    if (!overviewV1) {
      throw new Error(`Couldn't fetch workflow overview for ${workflowId}`);
    }
    return mapToWorkflowOverviewDTO(overviewV1);
  }

  export async function getWorkflows(
    sonataFlowService: SonataFlowService,
    dataIndexService: DataIndexService,
  ): Promise<WorkflowListResultDTO> {
    const definitions: WorkflowListResult = await V1.getWorkflows(
      sonataFlowService,
      dataIndexService,
    );
    return mapToWorkflowListResultDTO(definitions);
  }

  export async function getWorkflowById(
    sonataFlowService: SonataFlowService,
    workflowId: string,
  ): Promise<WorkflowDTO> {
    const resultV1 = await V1.getWorkflowById(sonataFlowService, workflowId);
    return mapToWorkflowDTO(resultV1.uri, resultV1.definition);
  }

  export async function getInstances(
    dataIndexService: DataIndexService,
  ): Promise<ProcessInstancesDTO> {
    const instances = await V1.getInstances(dataIndexService);
    const result = instances.map(def => mapToProcessInstanceDTO(def));

    return result;
  }

  export async function getInstanceById(
    dataIndexService: DataIndexService,
    instanceId: string,
    includeAssessment?: string,
  ): Promise<AssessedProcessInstanceDTO> {
    const instance: AssessedProcessInstance = await V1.getInstanceById(
      dataIndexService,
      instanceId,
      includeAssessment,
    );

    if (!instance) {
      throw new Error(`Couldn't fetch process instance ${instanceId}`);
    }

    return {
      instance: mapToProcessInstanceDTO(instance.instance),
      assessedBy: instance.assessedBy
        ? mapToProcessInstanceDTO(instance.assessedBy)
        : undefined,
    };
  }

  export function extractQueryParam(
    req: ParsedRequest,
    key: string,
  ): string | undefined {
    return req.query[key] as string | undefined;
  }
}
