package com.commercebank.www.domain;


import java.time.ZonedDateTime;

import org.javers.core.metamodel.object.CdoSnapshot;
import org.joda.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.io.Serializable;
import java.util.Objects;


public class EntityAuditEvent implements Serializable{

    private static final long serialVersionUID = 1L;
    
    private String id;

    private String entityId;

    private String entityType;

    private String action;

    private String entityValue;

    private Integer commitVersion;

    private String modifiedBy;

    private ZonedDateTime modifiedDate;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntityValue() {
        return entityValue;
    }

    public void setEntityValue(String entityValue) {
        this.entityValue = entityValue;
    }

    public Integer getCommitVersion() {
        return commitVersion;
    }

    public void setCommitVersion(Integer commitVersion) {
        this.commitVersion = commitVersion;
    }

    public String getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public ZonedDateTime getModifiedDate() {
        return modifiedDate;
    }

    public void setModifiedDate(ZonedDateTime modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        EntityAuditEvent entityAuditEvent = (EntityAuditEvent) o;
        return Objects.equals(id, entityAuditEvent.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "EntityAuditEvent{" +
            "id=" + id +
            ", entityId='" + entityId + "'" +
            ", entityType='" + entityType + "'" +
            ", action='" + action + "'" +
            ", entityValue='" + entityValue + "'" +
            ", commitVersion='" + commitVersion + "'" +
            ", modifiedBy='" + modifiedBy + "'" +
            ", modifiedDate='" + modifiedDate + "'" +
            '}';
    }

    
    public static EntityAuditEvent fromJaversSnapshot(CdoSnapshot snapshot) {
        EntityAuditEvent entityAuditEvent = new EntityAuditEvent();

        switch (snapshot.getType()) {
            case INITIAL:
                entityAuditEvent.setAction("CREATE");
                break;
            case UPDATE:
                entityAuditEvent.setAction("UPDATE");
                break;
            case TERMINAL:
                entityAuditEvent.setAction("DELETE");
                break;
        }

        entityAuditEvent.setId(snapshot.getCommitId().toString());
        entityAuditEvent.setCommitVersion(Math.round(snapshot.getVersion()));
        entityAuditEvent.setEntityType(snapshot.getManagedType().getName());
        entityAuditEvent.setEntityId(snapshot.getGlobalId().value().split("/")[1]);
        entityAuditEvent.setModifiedBy(snapshot.getCommitMetadata().getAuthor());

        if (snapshot.getState().getProperties().size() > 0) {
            int count = 0;
            StringBuilder sb = new StringBuilder("{");

            for (String s:snapshot.getState().getProperties()) {
                count++;
                Object propertyValue = snapshot.getPropertyValue(s);
                sb.append("\"" + s + "\": \"" + propertyValue + "\"");
                if (count < snapshot.getState().getProperties().size()) {
                  sb.append(",");
                }
             }

             sb.append("}");
             entityAuditEvent.setEntityValue(sb.toString());
        }
        LocalDateTime localTime = snapshot.getCommitMetadata().getCommitDate();

        ZonedDateTime modifyDate = ZonedDateTime.of(localTime.getYear(),
          localTime.getMonthOfYear(),
          localTime.getDayOfMonth(),
          localTime.getHourOfDay(),
          localTime.getMinuteOfHour(),
          localTime.getSecondOfMinute(),
          localTime.getMillisOfSecond(),
          ZoneId.systemDefault());

        entityAuditEvent.setModifiedDate(modifyDate);

        return entityAuditEvent;

    }

}
